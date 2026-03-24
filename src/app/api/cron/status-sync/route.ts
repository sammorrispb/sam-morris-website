import { Client } from "@notionhq/client";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { notifySam } from "@/lib/email";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function chunk<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size));
  return chunks;
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.replace("Bearer ", "");
  if (!token || token !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const notionKey = process.env.NOTION_API_KEY?.trim();
  const notionDb = process.env.NOTION_LEADS_DB_ID?.trim();
  const sbUrl = process.env.LND_SUPABASE_URL?.trim();
  const sbKey = process.env.LND_SUPABASE_SERVICE_KEY?.trim();

  if (!notionKey || !notionDb) {
    return NextResponse.json({ error: "Notion not configured" }, { status: 500 });
  }
  if (!sbUrl || !sbKey) {
    return NextResponse.json({ error: "Hub Supabase not configured" }, { status: 500 });
  }

  try {
    const notion = new Client({ auth: notionKey });

    // Query leads that could be advanced: Status in [New, Contacted]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allPages: any[] = [];
    let cursor: string | undefined;

    do {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await notion.dataSources.query({
        data_source_id: notionDb,
        filter: {
          or: [
            { property: "Status", select: { equals: "New" } },
            { property: "Status", select: { equals: "Contacted" } },
          ],
        },
        start_cursor: cursor,
        page_size: 100,
      });
      allPages.push(...response.results);
      cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined;
    } while (cursor);

    if (allPages.length === 0) {
      return NextResponse.json({ message: "No leads to sync", updated: 0 });
    }

    // Extract lead info
    interface LeadPage { id: string; email: string; status: string; name: string }
    const leads: LeadPage[] = allPages.map((page) => ({
      id: page.id,
      email: (page.properties.Email?.email ?? "").toLowerCase().trim(),
      status: page.properties.Status?.select?.name ?? "",
      name: page.properties.Name?.title?.[0]?.plain_text ?? "",
    })).filter((l) => l.email);

    const emails = leads.map((l) => l.email);

    // Query Hub Supabase for conversion signals (same pattern as funnel cron)
    const supabase = createClient(sbUrl, sbKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const hubSignups = new Map<string, { profileId: string | null }>();
    const rsvpProfileIds = new Set<string>();
    const attendedEmails = new Set<string>();

    // Profiles: who signed up on the Hub?
    for (const batch of chunk(emails, 100)) {
      const { data } = await supabase.from("profiles").select("id, email").in("email", batch);
      if (data) {
        for (const p of data) {
          hubSignups.set((p.email || "").toLowerCase().trim(), { profileId: p.id });
        }
      }
    }

    // RSVPs: who registered for an event?
    const profileIds = Array.from(hubSignups.values())
      .map((v) => v.profileId)
      .filter((id): id is string => !!id);

    if (profileIds.length > 0) {
      for (const batch of chunk(profileIds, 100)) {
        const { data } = await supabase.from("pending_cr_registrations").select("player_id").in("player_id", batch);
        if (data) {
          for (const r of data) rsvpProfileIds.add(r.player_id);
        }
      }
    }

    // Attendance: who actually showed up?
    for (const batch of chunk(emails, 100)) {
      const { data } = await supabase.from("newcomer_journey").select("email, event_count").in("email", batch);
      if (data) {
        for (const j of data) {
          if ((j.event_count ?? 0) > 0) {
            attendedEmails.add((j.email || "").toLowerCase().trim());
          }
        }
      }
    }

    // Determine status advances
    const updates: Array<{ id: string; name: string; email: string; from: string; to: string }> = [];

    for (const lead of leads) {
      let newStatus: string | null = null;

      if (attendedEmails.has(lead.email)) {
        // Attended → Converted (from either New or Contacted)
        if (lead.status !== "Converted") newStatus = "Converted";
      } else {
        const signup = hubSignups.get(lead.email);
        if (signup) {
          const hasRsvp = signup.profileId && rsvpProfileIds.has(signup.profileId);
          if (hasRsvp || lead.status === "New") {
            // Signed up or RSVP'd → Contacted (only advance, never downgrade)
            if (lead.status === "New") newStatus = "Contacted";
          }
        }
      }

      if (newStatus) {
        updates.push({ id: lead.id, name: lead.name, email: lead.email, from: lead.status, to: newStatus });
      }
    }

    // Apply Notion updates
    for (const update of updates) {
      try {
        await notion.pages.update({
          page_id: update.id,
          properties: {
            Status: { select: { name: update.to } },
          },
        });
      } catch (err) {
        console.error(`Status-sync: Failed to update ${update.email}:`, err);
      }
    }

    // Notify Sam if there were changes
    if (updates.length > 0) {
      const lines = updates.map((u) => `- ${u.name} (${u.email}): ${u.from} → ${u.to}`);
      try {
        await notifySam(
          `Status sync: ${updates.length} lead${updates.length > 1 ? "s" : ""} advanced`,
          `Automatic status updates based on Hub activity:\n\n${lines.join("\n")}\n\nReview: https://www.sammorrispb.com/admin`
        );
      } catch {
        console.error("Status-sync: notification email to Sam failed");
      }
    }

    return NextResponse.json({ message: "Status sync complete", updated: updates.length });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("Status-sync cron error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
