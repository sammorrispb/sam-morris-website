import { Client } from "@notionhq/client";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

/* ------------------------------------------------------------------ */
/*  Auth & config helpers (same pattern as /api/admin/leads)          */
/* ------------------------------------------------------------------ */

function validateAuth(request: Request): boolean {
  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.replace("Bearer ", "");
  return !!token && token === process.env.ADMIN_PASSWORD;
}

function getNotionConfig() {
  const apiKey = process.env.NOTION_API_KEY?.trim();
  const dbId = process.env.NOTION_LEADS_DB_ID?.trim();
  if (!apiKey || !dbId) return null;
  return { apiKey, dbId };
}

function getSupabaseConfig() {
  const url = process.env.LND_SUPABASE_URL?.trim();
  const key = process.env.LND_SUPABASE_SERVICE_KEY?.trim();
  if (!url || !key) return null;
  return { url, key };
}

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

interface FunnelStep {
  count: number;
  rate: string;
}

interface FunnelReport {
  period: string;
  overall: {
    leads: number;
    hubSignups: FunnelStep;
    profileComplete: FunnelStep;
    rsvpd: FunnelStep;
    attended: FunnelStep;
  };
  byInterest: Record<
    string,
    { leads: number; hubSignups: number; attended: number }
  >;
  recentLeads: Array<{
    name: string;
    email: string;
    interest: string;
    date: string;
    stage: "lead" | "signed_up" | "profile_complete" | "rsvpd" | "attended";
    eventsAttended: number;
  }>;
}

interface NotionLead {
  name: string;
  email: string;
  interest: string;
  status: string;
  date: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function pct(numerator: number, denominator: number): string {
  if (denominator === 0) return "0%";
  return `${((numerator / denominator) * 100).toFixed(1)}%`;
}

/** Batch an array into chunks of `size` */
function chunk<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

/* ------------------------------------------------------------------ */
/*  GET /api/admin/funnel                                             */
/* ------------------------------------------------------------------ */

export async function GET(request: Request) {
  if (!validateAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const notionCfg = getNotionConfig();
  if (!notionCfg) {
    return NextResponse.json(
      { error: "Notion not configured" },
      { status: 500 }
    );
  }

  const url = new URL(request.url);
  const days = Math.min(365, Math.max(1, Number(url.searchParams.get("days")) || 90));
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const cutoffISO = cutoff.toISOString().split("T")[0]; // YYYY-MM-DD

  try {
    /* ----- 1. Query Notion leads (last N days) ----- */
    const notion = new Client({ auth: notionCfg.apiKey });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allPages: any[] = [];
    let cursor: string | undefined;

    do {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await notion.dataSources.query({
        data_source_id: notionCfg.dbId,
        filter: {
          property: "Date Submitted",
          date: { on_or_after: cutoffISO },
        },
        sorts: [{ property: "Date Submitted", direction: "descending" }],
        start_cursor: cursor,
        page_size: 100,
      });
      allPages.push(...response.results);
      cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined;
    } while (cursor);

    const leads: NotionLead[] = allPages.map((page) => {
      const props = page.properties;
      return {
        name: props.Name?.title?.[0]?.plain_text ?? "",
        email: (props.Email?.email ?? "").toLowerCase().trim(),
        interest: props.Interest?.select?.name ?? "",
        status: props.Status?.select?.name ?? "",
        date: props["Date Submitted"]?.date?.start ?? "",
      };
    });

    // Dedupe by email (keep earliest submission)
    const emailToLead = new Map<string, NotionLead>();
    for (const lead of leads) {
      if (!lead.email) continue;
      if (!emailToLead.has(lead.email)) {
        emailToLead.set(lead.email, lead);
      }
    }
    const uniqueLeads = Array.from(emailToLead.values());
    const emails = uniqueLeads.map((l) => l.email).filter(Boolean);

    /* ----- 2. Query Hub Supabase for matching emails ----- */
    const sbCfg = getSupabaseConfig();

    // Maps: email -> data from Supabase
    const hubSignups = new Map<string, { createdAt: string; firstName: string | null; profileId: string | null }>();
    const rsvpProfileIds = new Set<string>();
    const attendedEmails = new Set<string>();
    const eventCounts = new Map<string, number>();

    if (sbCfg && emails.length > 0) {
      const supabase = createClient(sbCfg.url, sbCfg.key, {
        auth: { autoRefreshToken: false, persistSession: false },
      });

      // 2a. Check profiles table for signups + profile completion
      const emailBatches = chunk(emails, 100);
      for (const batch of emailBatches) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, email, first_name, created_at")
          .in("email", batch);

        if (profiles) {
          for (const p of profiles) {
            const email = (p.email ?? "").toLowerCase().trim();
            hubSignups.set(email, {
              createdAt: p.created_at,
              firstName: p.first_name,
              profileId: p.id,
            });
          }
        }
      }

      // 2b. Check pending_cr_registrations for RSVPs (by profile ID)
      const profileIds = Array.from(hubSignups.values())
        .map((v) => v.profileId)
        .filter((id): id is string => !!id);

      if (profileIds.length > 0) {
        const pidBatches = chunk(profileIds, 100);
        for (const batch of pidBatches) {
          const { data: rsvps } = await supabase
            .from("pending_cr_registrations")
            .select("profile_id")
            .in("profile_id", batch);

          if (rsvps) {
            for (const r of rsvps) {
              rsvpProfileIds.add(r.profile_id);
            }
          }
        }
      }

      // 2c. Check newcomer_journey for attendance (event_count > 0)
      for (const batch of emailBatches) {
        const { data: journeys } = await supabase
          .from("newcomer_journey")
          .select("email, event_count")
          .in("email", batch);

        if (journeys) {
          for (const j of journeys) {
            const email = (j.email ?? "").toLowerCase().trim();
            const count = j.event_count ?? 0;
            eventCounts.set(email, count);
            if (count > 0) {
              attendedEmails.add(email);
            }
          }
        }
      }
    }

    /* ----- 3. Compute funnel stages per lead ----- */
    type Stage = "lead" | "signed_up" | "profile_complete" | "rsvpd" | "attended";

    function getStage(email: string): Stage {
      // Furthest step reached
      if (attendedEmails.has(email)) return "attended";

      const signup = hubSignups.get(email);
      if (signup) {
        const hasRsvp = signup.profileId ? rsvpProfileIds.has(signup.profileId) : false;
        if (hasRsvp) return "rsvpd";
        if (signup.firstName) return "profile_complete";
        return "signed_up";
      }

      return "lead";
    }

    let hubSignupCount = 0;
    let profileCompleteCount = 0;
    let rsvpdCount = 0;
    let attendedCount = 0;

    const byInterest: Record<string, { leads: number; hubSignups: number; attended: number }> = {};
    const recentLeads: FunnelReport["recentLeads"] = [];

    for (const lead of uniqueLeads) {
      const stage = getStage(lead.email);

      // Count cumulative funnel (each stage includes all stages beyond it)
      if (stage !== "lead") hubSignupCount++;
      if (stage === "profile_complete" || stage === "rsvpd" || stage === "attended") profileCompleteCount++;
      if (stage === "rsvpd" || stage === "attended") rsvpdCount++;
      if (stage === "attended") attendedCount++;

      // By interest
      if (lead.interest) {
        if (!byInterest[lead.interest]) {
          byInterest[lead.interest] = { leads: 0, hubSignups: 0, attended: 0 };
        }
        byInterest[lead.interest].leads++;
        if (stage !== "lead") byInterest[lead.interest].hubSignups++;
        if (stage === "attended") byInterest[lead.interest].attended++;
      }

      // Recent leads list (include all)
      recentLeads.push({
        name: lead.name,
        email: lead.email,
        interest: lead.interest,
        date: lead.date,
        stage,
        eventsAttended: eventCounts.get(lead.email) ?? 0,
      });
    }

    const totalLeads = uniqueLeads.length;

    const report: FunnelReport = {
      period: `Last ${days} days`,
      overall: {
        leads: totalLeads,
        hubSignups: {
          count: hubSignupCount,
          rate: pct(hubSignupCount, totalLeads),
        },
        profileComplete: {
          count: profileCompleteCount,
          rate: pct(profileCompleteCount, totalLeads),
        },
        rsvpd: {
          count: rsvpdCount,
          rate: pct(rsvpdCount, totalLeads),
        },
        attended: {
          count: attendedCount,
          rate: pct(attendedCount, totalLeads),
        },
      },
      byInterest,
      recentLeads,
    };

    return NextResponse.json(report);
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("Admin funnel error:", msg);
    return NextResponse.json(
      { error: `Failed to generate funnel report: ${msg}` },
      { status: 500 }
    );
  }
}
