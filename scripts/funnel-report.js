#!/usr/bin/env node
/**
 * Lead → Hub Conversion Funnel Report
 *
 * Usage:
 *   node --env-file=.env.local scripts/funnel-report.js [days]
 *
 * Queries Notion leads + Hub Supabase to compute:
 *   Website lead → Hub signup → Profile complete → RSVP'd → Attended event
 */

import { Client } from "@notionhq/client";
import { createClient } from "@supabase/supabase-js";

const days = Math.min(365, Math.max(1, Number(process.argv[2]) || 90));
const cutoff = new Date();
cutoff.setDate(cutoff.getDate() - days);
const cutoffISO = cutoff.toISOString().split("T")[0];

const NOTION_API_KEY = process.env.NOTION_API_KEY?.trim();
const NOTION_LEADS_DB_ID = process.env.NOTION_LEADS_DB_ID?.trim();
const LND_SUPABASE_URL = process.env.LND_SUPABASE_URL?.trim();
const LND_SUPABASE_SERVICE_KEY = process.env.LND_SUPABASE_SERVICE_KEY?.trim();

if (!NOTION_API_KEY || !NOTION_LEADS_DB_ID) {
  console.error("Missing NOTION_API_KEY or NOTION_LEADS_DB_ID");
  process.exit(1);
}

function chunk(arr, size) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size));
  return chunks;
}

function pct(n, d) {
  if (d === 0) return "0.0%";
  return `${((n / d) * 100).toFixed(1)}%`;
}

function bar(value, max, width = 30) {
  const filled = max === 0 ? 0 : Math.round((value / max) * width);
  return "█".repeat(filled) + "░".repeat(width - filled);
}

function stageLabel(stage) {
  const labels = { lead: "Lead", signed_up: "Signed Up", profile_complete: "Profile Done", rsvpd: "RSVP'd", attended: "Attended" };
  return labels[stage] || stage;
}

function stageIcon(stage) {
  const icons = { lead: "○", signed_up: "◐", profile_complete: "◑", rsvpd: "◕", attended: "●" };
  return icons[stage] || "○";
}

async function main() {
  // 1. Query Notion leads
  const notion = new Client({ auth: NOTION_API_KEY });
  const allPages = [];
  let cursor;

  do {
    const response = await notion.dataSources.query({
      data_source_id: NOTION_LEADS_DB_ID,
      filter: { property: "Date Submitted", date: { on_or_after: cutoffISO } },
      sorts: [{ property: "Date Submitted", direction: "descending" }],
      start_cursor: cursor,
      page_size: 100,
    });
    allPages.push(...response.results);
    cursor = response.has_more ? response.next_cursor : undefined;
  } while (cursor);

  const leads = allPages.map((page) => {
    const props = page.properties;
    return {
      name: props.Name?.title?.[0]?.plain_text ?? "",
      email: (props.Email?.email ?? "").toLowerCase().trim(),
      interest: props.Interest?.select?.name ?? "",
      status: props.Status?.select?.name ?? "",
      date: props["Date Submitted"]?.date?.start ?? "",
    };
  });

  // Dedupe by email
  const emailToLead = new Map();
  for (const lead of leads) {
    if (!lead.email) continue;
    if (!emailToLead.has(lead.email)) emailToLead.set(lead.email, lead);
  }
  const uniqueLeads = Array.from(emailToLead.values());
  const emails = uniqueLeads.map((l) => l.email).filter(Boolean);

  // 2. Query Hub Supabase
  const hubSignups = new Map();
  const rsvpProfileIds = new Set();
  const attendedEmails = new Set();
  const eventCounts = new Map();

  if (LND_SUPABASE_URL && LND_SUPABASE_SERVICE_KEY && emails.length > 0) {
    const supabase = createClient(LND_SUPABASE_URL, LND_SUPABASE_SERVICE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const emailBatches = chunk(emails, 100);

    // Profiles
    for (const batch of emailBatches) {
      const { data } = await supabase.from("profiles").select("id, email, first_name, created_at").in("email", batch);
      if (data) for (const p of data) hubSignups.set((p.email || "").toLowerCase().trim(), { firstName: p.first_name, profileId: p.id });
    }

    // RSVPs
    const profileIds = Array.from(hubSignups.values()).map((v) => v.profileId).filter(Boolean);
    if (profileIds.length > 0) {
      for (const batch of chunk(profileIds, 100)) {
        const { data } = await supabase.from("pending_cr_registrations").select("player_id").in("player_id", batch);
        if (data) for (const r of data) rsvpProfileIds.add(r.player_id);
      }
    }

    // Attendance
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

  // 3. Compute stages
  function getStage(email) {
    if (attendedEmails.has(email)) return "attended";
    const signup = hubSignups.get(email);
    if (signup) {
      if (signup.profileId && rsvpProfileIds.has(signup.profileId)) return "rsvpd";
      if (signup.firstName) return "profile_complete";
      return "signed_up";
    }
    return "lead";
  }

  let hubSignupCount = 0, profileCompleteCount = 0, rsvpdCount = 0, attendedCount = 0;
  const byInterest = {};
  const leadDetails = [];

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

    leadDetails.push({ ...lead, stage, events: eventCounts.get(lead.email) || 0 });
  }

  const total = uniqueLeads.length;

  // 4. Output
  console.log(`\n  LEAD FUNNEL REPORT — Last ${days} days`);
  console.log(`  ${"═".repeat(50)}\n`);

  console.log(`  Leads          ${bar(total, total)} ${total}`);
  console.log(`  Hub Signups    ${bar(hubSignupCount, total)} ${hubSignupCount}  (${pct(hubSignupCount, total)})`);
  console.log(`  Profile Done   ${bar(profileCompleteCount, total)} ${profileCompleteCount}  (${pct(profileCompleteCount, total)})`);
  console.log(`  RSVP'd         ${bar(rsvpdCount, total)} ${rsvpdCount}  (${pct(rsvpdCount, total)})`);
  console.log(`  Attended       ${bar(attendedCount, total)} ${attendedCount}  (${pct(attendedCount, total)})`);

  console.log(`\n  CONVERSION RATES`);
  console.log(`  ${"─".repeat(50)}`);
  console.log(`  Lead → Signup:    ${pct(hubSignupCount, total)}`);
  console.log(`  Lead → Attended:  ${pct(attendedCount, total)}`);
  console.log(`  Signup → Attended: ${pct(attendedCount, hubSignupCount)}`);

  // By interest
  const interests = Object.entries(byInterest).sort((a, b) => b[1].leads - a[1].leads);
  if (interests.length > 0) {
    console.log(`\n  BY INTEREST`);
    console.log(`  ${"─".repeat(50)}`);
    console.log(`  ${"Interest".padEnd(28)} Leads  Signup  Attend  Conv`);
    for (const [name, data] of interests) {
      const short = name.length > 26 ? name.slice(0, 24) + ".." : name;
      console.log(`  ${short.padEnd(28)} ${String(data.leads).padStart(5)}  ${String(data.hubSignups).padStart(6)}  ${String(data.attended).padStart(6)}  ${pct(data.attended, data.leads).padStart(5)}`);
    }
  }

  // Leads needing attention (stuck at lead or signed_up for > 7 days)
  const sevenDaysAgo = new Date(Date.now() - 7 * 86400000);
  const stuckLeads = leadDetails.filter((l) => {
    if (l.stage !== "lead" && l.stage !== "signed_up") return false;
    return l.date && new Date(l.date) < sevenDaysAgo;
  });

  if (stuckLeads.length > 0) {
    console.log(`\n  NEEDS ATTENTION (stuck > 7 days)`);
    console.log(`  ${"─".repeat(50)}`);
    for (const l of stuckLeads.slice(0, 15)) {
      const daysAgo = Math.floor((Date.now() - new Date(l.date).getTime()) / 86400000);
      console.log(`  ${stageIcon(l.stage)} ${l.name.padEnd(20)} ${l.interest.slice(0, 16).padEnd(17)} ${stageLabel(l.stage).padEnd(14)} ${daysAgo}d ago`);
    }
    if (stuckLeads.length > 15) console.log(`  ... and ${stuckLeads.length - 15} more`);
  }

  // Recent leads
  console.log(`\n  RECENT LEADS (last 10)`);
  console.log(`  ${"─".repeat(50)}`);
  for (const l of leadDetails.slice(0, 10)) {
    const evts = l.events > 0 ? ` (${l.events} events)` : "";
    console.log(`  ${stageIcon(l.stage)} ${l.name.padEnd(20)} ${stageLabel(l.stage).padEnd(14)} ${l.interest.slice(0, 20)}${evts}`);
  }

  console.log(`\n  Total: ${total} leads, ${hubSignupCount} signups, ${attendedCount} attended\n`);
}

main().catch((err) => {
  console.error("Funnel report failed:", err.message);
  process.exit(1);
});
