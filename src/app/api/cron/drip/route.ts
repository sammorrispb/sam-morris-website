import { Client } from "@notionhq/client";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { sendEmail, notifySam } from "@/lib/email";
import { getDripEmail } from "@/lib/dripTemplates";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Days since submission before each step is sent
const STEP_SCHEDULE = [2, 5, 10];

function daysSince(dateStr: string): number {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
}

function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.replace("Bearer ", "");
  if (!token || token !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const notionKey = process.env.NOTION_API_KEY?.trim();
  const notionDb = process.env.NOTION_LEADS_DB_ID?.trim();
  if (!notionKey || !notionDb) {
    return NextResponse.json({ error: "Notion not configured" }, { status: 500 });
  }

  try {
    const notion = new Client({ auth: notionKey });

    // Query leads eligible for drip: Status=New, Step<3, not opted out
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await notion.dataSources.query({
      data_source_id: notionDb,
      filter: {
        and: [
          { property: "Status", select: { equals: "New" } },
          { property: "Drip Step", number: { less_than: 3 } },
          { property: "Drip Opted Out", checkbox: { equals: false } },
        ],
      },
      sorts: [{ property: "Date Submitted", direction: "ascending" }],
      page_size: 100,
    });

    const pages = response.results ?? [];
    if (pages.length === 0) {
      return NextResponse.json({ message: "No drip-eligible leads", sent: 0 });
    }

    // Check L&D membership in bulk
    const sbUrl = process.env.LND_SUPABASE_URL?.trim();
    const sbKey = process.env.LND_SUPABASE_SERVICE_KEY?.trim();
    const lndMembers = new Set<string>();

    if (sbUrl && sbKey) {
      try {
        const supabase = createClient(sbUrl, sbKey, {
          auth: { autoRefreshToken: false, persistSession: false },
        });
        const { data } = await supabase.auth.admin.listUsers({ perPage: 1000 });
        if (data?.users) {
          for (const u of data.users) {
            if (u.email) lndMembers.add(u.email.toLowerCase());
          }
        }
      } catch {
        console.error("Drip: L&D membership check failed, continuing without it");
      }
    }

    const today = todayISO();
    const counts = { step1: 0, step2: 0, step3: 0, skipped: 0 };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const page of pages as any[]) {
      const props = page.properties;
      const name = props.Name?.title?.[0]?.plain_text ?? "there";
      const email = (props.Email?.email ?? "").toLowerCase().trim();
      const interest = props.Interest?.select?.name ?? "";
      const dateSubmitted = props["Date Submitted"]?.date?.start ?? "";
      const currentStep = props["Drip Step"]?.number ?? 0;
      const lastDripAt = props["Last Drip At"]?.date?.start ?? "";

      if (!email || !interest || !dateSubmitted) {
        counts.skipped++;
        continue;
      }

      // Idempotency: skip if we already sent today
      if (lastDripAt && lastDripAt.startsWith(today)) {
        counts.skipped++;
        continue;
      }

      const days = daysSince(dateSubmitted);
      const nextStep = currentStep + 1;

      // Check if enough days have passed for the next step
      const requiredDays = STEP_SCHEDULE[currentStep];
      if (requiredDays === undefined || days < requiredDays) {
        counts.skipped++;
        continue;
      }

      const dripEmail = getDripEmail(interest, nextStep, name);
      if (!dripEmail) {
        counts.skipped++;
        continue;
      }

      // Send the email (CC nextgenacademypb for Youth Programs)
      const cc = interest === "Youth Programs" ? "nextgenacademypb@gmail.com" : undefined;
      const result = await sendEmail(email, dripEmail.subject, dripEmail.body, cc);

      if (result.success) {
        // Update Notion: increment step + set last drip date
        try {
          await notion.pages.update({
            page_id: page.id,
            properties: {
              "Drip Step": { number: nextStep },
              "Last Drip At": { date: { start: new Date().toISOString() } },
            },
          });
        } catch (updateErr) {
          console.error(`Drip: Failed to update Notion for ${email}:`, updateErr);
        }

        if (nextStep === 1) counts.step1++;
        else if (nextStep === 2) counts.step2++;
        else counts.step3++;
      } else {
        console.error(`Drip: Failed to send to ${email}:`, result.error);
        counts.skipped++;
      }
    }

    const total = counts.step1 + counts.step2 + counts.step3;

    // Notify Sam with summary
    if (total > 0) {
      try {
        await notifySam(
          `Drip: sent ${total} email${total > 1 ? "s" : ""}`,
          `Drip sequence summary:\n\n` +
          `Step 1 (Day 2 nudge): ${counts.step1}\n` +
          `Step 2 (Day 5 value): ${counts.step2}\n` +
          `Step 3 (Day 10 close): ${counts.step3}\n` +
          `Skipped: ${counts.skipped}\n\n` +
          `Review leads: https://www.sammorrispb.com/admin`
        );
      } catch {
        console.error("Drip: notification email to Sam failed");
      }
    }

    return NextResponse.json({ message: "Drip complete", sent: total, ...counts });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("Drip cron error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
