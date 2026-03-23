import { Client } from "@notionhq/client";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { CONTACT } from "@/lib/constants";

export const maxDuration = 60;

function validateCron(request: Request): boolean {
  const auth = request.headers.get("Authorization");
  return auth === `Bearer ${process.env.CRON_SECRET}`;
}

function pct(n: number, d: number): string {
  if (d === 0) return "0.0%";
  return `${((n / d) * 100).toFixed(1)}%`;
}

function bar(value: number, max: number, width = 25): string {
  const filled = max === 0 ? 0 : Math.round((value / max) * width);
  return "\u2588".repeat(filled) + "\u2591".repeat(width - filled);
}

function chunk<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size));
  return chunks;
}

export async function GET(request: Request) {
  if (!validateCron(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const notionKey = process.env.NOTION_API_KEY?.trim();
  const notionDb = process.env.NOTION_LEADS_DB_ID?.trim();
  const sbUrl = process.env.LND_SUPABASE_URL?.trim();
  const sbKey = process.env.LND_SUPABASE_SERVICE_KEY?.trim();

  if (!notionKey || !notionDb) {
    return NextResponse.json({ error: "Notion not configured" }, { status: 500 });
  }

  try {
    const days = 30;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const cutoffISO = cutoff.toISOString().split("T")[0];

    // 1. Query Notion leads
    const notion = new Client({ auth: notionKey });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allPages: any[] = [];
    let cursor: string | undefined;

    do {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await notion.dataSources.query({
        data_source_id: notionDb,
        filter: { property: "Date Submitted", date: { on_or_after: cutoffISO } },
        sorts: [{ property: "Date Submitted", direction: "descending" }],
        start_cursor: cursor,
        page_size: 100,
      });
      allPages.push(...response.results);
      cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined;
    } while (cursor);

    interface Lead { name: string; email: string; interest: string; date: string; }
    const leads: Lead[] = allPages.map((page) => {
      const props = page.properties;
      return {
        name: props.Name?.title?.[0]?.plain_text ?? "",
        email: (props.Email?.email ?? "").toLowerCase().trim(),
        interest: props.Interest?.select?.name ?? "",
        date: props["Date Submitted"]?.date?.start ?? "",
      };
    });

    const emailToLead = new Map<string, Lead>();
    for (const lead of leads) {
      if (lead.email && !emailToLead.has(lead.email)) emailToLead.set(lead.email, lead);
    }
    const uniqueLeads = Array.from(emailToLead.values());
    const emails = uniqueLeads.map((l) => l.email).filter(Boolean);

    // 2. Query Hub Supabase
    const hubSignups = new Map<string, { firstName: string | null; profileId: string | null }>();
    const rsvpProfileIds = new Set<string>();
    const attendedEmails = new Set<string>();
    const eventCounts = new Map<string, number>();

    if (sbUrl && sbKey && emails.length > 0) {
      const supabase = createClient(sbUrl, sbKey, { auth: { autoRefreshToken: false, persistSession: false } });
      const emailBatches = chunk(emails, 100);

      for (const batch of emailBatches) {
        const { data } = await supabase.from("profiles").select("id, email, first_name").in("email", batch);
        if (data) for (const p of data) hubSignups.set((p.email || "").toLowerCase().trim(), { firstName: p.first_name, profileId: p.id });
      }

      const profileIds = Array.from(hubSignups.values()).map((v) => v.profileId).filter((id): id is string => !!id);
      if (profileIds.length > 0) {
        for (const batch of chunk(profileIds, 100)) {
          const { data } = await supabase.from("pending_cr_registrations").select("player_id").in("player_id", batch);
          if (data) for (const r of data) rsvpProfileIds.add(r.player_id);
        }
      }

      for (const batch of emailBatches) {
        const { data } = await supabase.from("newcomer_journey").select("email, event_count").in("email", batch);
        if (data) for (const j of data) {
          const email = (j.email || "").toLowerCase().trim();
          const count = j.event_count ?? 0;
          eventCounts.set(email, count);
          if (count > 0) attendedEmails.add(email);
        }
      }
    }

    // 3. Compute funnel
    type Stage = "lead" | "signed_up" | "profile_complete" | "rsvpd" | "attended";
    function getStage(email: string): Stage {
      if (attendedEmails.has(email)) return "attended";
      const signup = hubSignups.get(email);
      if (signup) {
        if (signup.profileId && rsvpProfileIds.has(signup.profileId)) return "rsvpd";
        if (signup.firstName) return "profile_complete";
        return "signed_up";
      }
      return "lead";
    }

    const stageLabels: Record<Stage, string> = { lead: "Lead", signed_up: "Signed Up", profile_complete: "Profile Done", rsvpd: "RSVP'd", attended: "Attended" };

    let hubSignupCount = 0, profileCompleteCount = 0, rsvpdCount = 0, attendedCount = 0;
    const byInterest: Record<string, { leads: number; hubSignups: number; attended: number }> = {};
    const stuckLeads: Array<Lead & { stage: Stage }> = [];

    for (const lead of uniqueLeads) {
      const stage = getStage(lead.email);
      if (stage !== "lead") hubSignupCount++;
      if (["profile_complete", "rsvpd", "attended"].includes(stage)) profileCompleteCount++;
      if (["rsvpd", "attended"].includes(stage)) rsvpdCount++;
      if (stage === "attended") attendedCount++;

      if (lead.interest) {
        if (!byInterest[lead.interest]) byInterest[lead.interest] = { leads: 0, hubSignups: 0, attended: 0 };
        byInterest[lead.interest].leads++;
        if (stage !== "lead") byInterest[lead.interest].hubSignups++;
        if (stage === "attended") byInterest[lead.interest].attended++;
      }

      const sevenDaysAgo = new Date(Date.now() - 7 * 86400000);
      if ((stage === "lead" || stage === "signed_up") && lead.date && new Date(lead.date) < sevenDaysAgo) {
        stuckLeads.push({ ...lead, stage });
      }
    }

    const total = uniqueLeads.length;

    // 4. Build email body
    let body = `LEAD FUNNEL — Last ${days} days\n${"=".repeat(45)}\n\n`;
    body += `Leads          ${bar(total, total)} ${total}\n`;
    body += `Hub Signups    ${bar(hubSignupCount, total)} ${hubSignupCount}  (${pct(hubSignupCount, total)})\n`;
    body += `Profile Done   ${bar(profileCompleteCount, total)} ${profileCompleteCount}  (${pct(profileCompleteCount, total)})\n`;
    body += `RSVP'd         ${bar(rsvpdCount, total)} ${rsvpdCount}  (${pct(rsvpdCount, total)})\n`;
    body += `Attended       ${bar(attendedCount, total)} ${attendedCount}  (${pct(attendedCount, total)})\n\n`;

    body += `Lead → Signup:     ${pct(hubSignupCount, total)}\n`;
    body += `Lead → Attended:   ${pct(attendedCount, total)}\n`;
    body += `Signup → Attended: ${pct(attendedCount, hubSignupCount)}\n\n`;

    const interests = Object.entries(byInterest).sort((a, b) => b[1].leads - a[1].leads);
    if (interests.length > 0) {
      body += `BY INTEREST\n${"-".repeat(45)}\n`;
      for (const [name, data] of interests) {
        body += `${name}: ${data.leads} leads → ${data.hubSignups} signups → ${data.attended} attended (${pct(data.attended, data.leads)})\n`;
      }
      body += "\n";
    }

    if (stuckLeads.length > 0) {
      body += `NEEDS ATTENTION (stuck > 7 days)\n${"-".repeat(45)}\n`;
      for (const l of stuckLeads.slice(0, 10)) {
        const daysAgo = Math.floor((Date.now() - new Date(l.date).getTime()) / 86400000);
        body += `${l.name} — ${l.interest} — ${stageLabels[l.stage]} — ${daysAgo}d ago\n`;
      }
    }

    // 5. Send to Sam
    const subject = `Funnel: ${total} leads, ${attendedCount} attended (${pct(attendedCount, total)})`;
    await sendEmail(CONTACT.email, subject, body);

    return NextResponse.json({
      ok: true,
      leads: total,
      hubSignups: hubSignupCount,
      attended: attendedCount,
      stuck: stuckLeads.length,
      emailSent: true,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("Funnel cron error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
