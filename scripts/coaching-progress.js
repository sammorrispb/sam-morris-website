#!/usr/bin/env node
/**
 * View coaching client progress and skill grid
 *
 * Usage:
 *   node --env-file=.env.local scripts/coaching-progress.js "Name"    — view one client
 *   node --env-file=.env.local scripts/coaching-progress.js           — list all clients
 */

import { Client } from "@notionhq/client";

const NOTION_API_KEY = process.env.NOTION_API_KEY?.trim();
const CLIENTS_DB_ID = process.env.NOTION_COACHING_CLIENTS_DB_ID?.trim();
const SKILLS_DB_ID = process.env.NOTION_COACHING_SKILLS_DB_ID?.trim();
const LESSONS_DB_ID = process.env.NOTION_COACHING_LESSONS_DB_ID?.trim();

if (!NOTION_API_KEY || !CLIENTS_DB_ID || !SKILLS_DB_ID || !LESSONS_DB_ID) {
  console.error("Missing env vars. Need: NOTION_API_KEY, NOTION_COACHING_CLIENTS_DB_ID, NOTION_COACHING_SKILLS_DB_ID, NOTION_COACHING_LESSONS_DB_ID");
  process.exit(1);
}

const clientName = process.argv[2] || "";
const notion = new Client({ auth: NOTION_API_KEY });

const LEVEL_ICONS = {
  "Introduced": "○",
  "Drilling": "◐",
  "Game-Ready": "◕",
  "Mastered": "●",
};

const CATEGORY_ORDER = [
  "Serves", "Returns", "Dinks", "Drops", "Volleys",
  "Lobs", "Drives", "Positioning", "Strategy", "Mental",
];

function prop(page, name) {
  return page.properties?.[name];
}

function titleText(page, name) {
  return prop(page, name)?.title?.[0]?.plain_text ?? "";
}

function selectName(page, name) {
  return prop(page, name)?.select?.name ?? "";
}

function numberVal(page, name) {
  return prop(page, name)?.number ?? 0;
}

function dateVal(page, name) {
  return prop(page, name)?.date?.start ?? "";
}

function richText(page, name) {
  return prop(page, name)?.rich_text?.[0]?.plain_text ?? "";
}

function multiSelectNames(page, name) {
  return (prop(page, name)?.multi_select ?? []).map((o) => o.name);
}

async function queryAll(dataSourceId, filter, sorts) {
  const all = [];
  let cursor;
  do {
    const params = { data_source_id: dataSourceId, page_size: 100 };
    if (filter) params.filter = filter;
    if (sorts) params.sorts = sorts;
    if (cursor) params.start_cursor = cursor;
    const response = await notion.dataSources.query(params);
    all.push(...response.results);
    cursor = response.has_more ? response.next_cursor : undefined;
  } while (cursor);
  return all;
}

async function listAllClients() {
  const clients = await queryAll(CLIENTS_DB_ID, null, [
    { property: "Status", direction: "ascending" },
  ]);

  if (clients.length === 0) {
    console.log("\n  No coaching clients found.\n");
    return;
  }

  console.log(`\n  COACHING CLIENTS — ${clients.length} total`);
  console.log(`  ${"═".repeat(60)}\n`);
  console.log(`  ${"Name".padEnd(22)} ${"Level".padEnd(6)} ${"Hours".padEnd(12)} Status`);
  console.log(`  ${"─".repeat(60)}`);

  for (const c of clients) {
    const name = titleText(c, "Name");
    const level = selectName(c, "Skill Level");
    const purchased = numberVal(c, "Hours Purchased");
    const used = numberVal(c, "Hours Used");
    const remaining = purchased - used;
    const status = selectName(c, "Status");

    const hoursStr = `${remaining}/${purchased}`;
    const statusStr = status || "—";
    const lowHours = remaining <= 1 && purchased > 0 ? " (!)" : "";

    console.log(`  ${name.padEnd(22)} ${level.padEnd(6)} ${hoursStr.padEnd(12)} ${statusStr}${lowHours}`);
  }
  console.log();
}

async function viewClient(name) {
  // Find client
  let response = await notion.dataSources.query({
    data_source_id: CLIENTS_DB_ID,
    filter: { property: "Name", title: { equals: name } },
    page_size: 1,
  });

  if (response.results.length === 0) {
    // Try contains
    response = await notion.dataSources.query({
      data_source_id: CLIENTS_DB_ID,
      filter: { property: "Name", title: { contains: name } },
      page_size: 5,
    });
    if (response.results.length === 0) {
      console.error(`\n  Client "${name}" not found.\n`);
      process.exit(1);
    }
    if (response.results.length > 1) {
      console.error(`\n  Multiple clients match "${name}":`);
      for (const r of response.results) {
        console.error(`    - ${titleText(r, "Name")}`);
      }
      console.error("  Use the full name.\n");
      process.exit(1);
    }
  }

  const client = response.results[0];
  const clientName = titleText(client, "Name");
  const level = selectName(client, "Skill Level");
  const purchased = numberVal(client, "Hours Purchased");
  const used = numberVal(client, "Hours Used");
  const remaining = purchased - used;
  const nextSession = dateVal(client, "Next Session");
  const status = selectName(client, "Status");

  // Header
  console.log(`\n  ${clientName.toUpperCase()} — ${level}`);
  console.log(`  Hours: ${purchased} purchased, ${used} used, ${remaining} remaining`);
  if (nextSession) {
    const d = new Date(nextSession + "T00:00:00");
    const formatted = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    console.log(`  Next session: ${formatted}`);
  }
  console.log(`  Status: ${status || "—"}`);

  // Fetch skills
  const skills = await queryAll(SKILLS_DB_ID, {
    property: "Client",
    relation: { contains: client.id },
  });

  // Group by category
  const byCategory = {};
  for (const s of skills) {
    const cat = selectName(s, "Category") || "Other";
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push({
      skill: titleText(s, "Skill"),
      level: selectName(s, "Level") || "Introduced",
      lastWorked: dateVal(s, "Last Worked"),
    });
  }

  // Print skill grid
  if (skills.length > 0) {
    console.log(`\n  SKILL PROGRESSION`);
    console.log(`  ${"═".repeat(45)}`);

    for (const cat of CATEGORY_ORDER) {
      if (!byCategory[cat]) continue;
      console.log(`  ${cat.toUpperCase()}`);
      for (const s of byCategory[cat]) {
        const icon = LEVEL_ICONS[s.level] || "○";
        const levelStr = s.level.padEnd(12);
        const skillStr = s.skill.padEnd(28);
        const workedStr = s.lastWorked ? ` (${s.lastWorked})` : "";
        console.log(`    ${icon} ${skillStr}${levelStr}${workedStr}`);
      }
      console.log();
    }

    // Any categories not in the standard order
    for (const [cat, entries] of Object.entries(byCategory)) {
      if (CATEGORY_ORDER.includes(cat)) continue;
      console.log(`  ${cat.toUpperCase()}`);
      for (const s of entries) {
        const icon = LEVEL_ICONS[s.level] || "○";
        console.log(`    ${icon} ${s.skill.padEnd(28)}${s.level.padEnd(12)}`);
      }
      console.log();
    }
  }

  // Fetch recent lessons
  const lessons = await queryAll(LESSONS_DB_ID, {
    property: "Client",
    relation: { contains: client.id },
  });

  // Sort by date descending
  lessons.sort((a, b) => {
    const da = dateVal(a, "Date") || "";
    const db = dateVal(b, "Date") || "";
    return db.localeCompare(da);
  });

  const recentLessons = lessons.slice(0, 5);

  if (recentLessons.length > 0) {
    console.log(`  RECENT LESSONS`);
    console.log(`  ${"─".repeat(45)}`);
    for (const l of recentLessons) {
      const date = dateVal(l, "Date");
      const dur = selectName(l, "Duration");
      const loc = selectName(l, "Location");
      const focus = multiSelectNames(l, "Focus Areas").join(", ");
      const sessionNotes = richText(l, "Session Notes");

      let formatted = "";
      if (date) {
        const d = new Date(date + "T00:00:00");
        formatted = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      }

      let line = `  ${formatted}`;
      if (dur) line += ` — ${dur}`;
      if (loc) line += ` @ ${loc}`;
      if (focus) line += ` — ${focus}`;
      console.log(line);
      if (sessionNotes) {
        console.log(`    "${sessionNotes}"`);
      }
    }
    if (lessons.length > 5) {
      console.log(`  ... and ${lessons.length - 5} more`);
    }
  } else {
    console.log(`  No lessons logged yet.`);
  }

  console.log();
}

async function main() {
  if (clientName) {
    await viewClient(clientName);
  } else {
    await listAllClients();
  }
}

main().catch((err) => {
  console.error("Progress report failed:", err.message);
  process.exit(1);
});
