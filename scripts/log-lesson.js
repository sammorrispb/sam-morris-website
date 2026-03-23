#!/usr/bin/env node
/**
 * Log a coaching lesson session
 *
 * Usage:
 *   node --env-file=.env.local scripts/log-lesson.js "Name" [options]
 *
 * Options:
 *   --focus "Skill1,Skill2"   Focus areas for the session
 *   --notes "Session notes"   Free-text session notes
 *   --hours 1                 Hours to charge (default: 1)
 *   --location Rockville      Location (Rockville or "North Bethesda")
 *   --duration 1hr            Duration (30min, 1hr, 1.5hr, 2hr)
 *   --date 2026-03-23         Session date (default: today)
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

// Parse args: first positional is name, rest are --flag value pairs
const args = process.argv.slice(2);
const clientName = args[0];

if (!clientName || clientName.startsWith("--")) {
  console.error('Usage: node --env-file=.env.local scripts/log-lesson.js "Name" --focus "skills" --notes "notes" --hours 1 --location Rockville --duration 1hr');
  process.exit(1);
}

function parseFlag(flag, defaultValue) {
  const idx = args.indexOf(flag);
  if (idx === -1 || idx + 1 >= args.length) return defaultValue;
  return args[idx + 1];
}

const focusRaw = parseFlag("--focus", "");
const notes = parseFlag("--notes", "");
const hours = Number(parseFlag("--hours", "1"));
const location = parseFlag("--location", "");
const duration = parseFlag("--duration", "1hr");
const dateStr = parseFlag("--date", new Date().toISOString().split("T")[0]);

const focusAreas = focusRaw ? focusRaw.split(",").map((s) => s.trim()).filter(Boolean) : [];

const validDurations = ["30min", "1hr", "1.5hr", "2hr"];
if (!validDurations.includes(duration)) {
  console.error(`Invalid duration "${duration}". Must be one of: ${validDurations.join(", ")}`);
  process.exit(1);
}

const validLocations = ["Rockville", "North Bethesda"];
if (location && !validLocations.includes(location)) {
  console.error(`Invalid location "${location}". Must be one of: ${validLocations.join(", ")}`);
  process.exit(1);
}

const notion = new Client({ auth: NOTION_API_KEY });

async function findClient(name) {
  const response = await notion.dataSources.query({
    data_source_id: CLIENTS_DB_ID,
    filter: { property: "Name", title: { equals: name } },
    page_size: 1,
  });
  if (response.results.length === 0) {
    // Try contains match for partial names
    const fuzzy = await notion.dataSources.query({
      data_source_id: CLIENTS_DB_ID,
      filter: { property: "Name", title: { contains: name } },
      page_size: 5,
    });
    if (fuzzy.results.length === 0) return null;
    if (fuzzy.results.length === 1) return fuzzy.results[0];
    console.error(`  Multiple clients match "${name}":`);
    for (const r of fuzzy.results) {
      const n = r.properties?.Name?.title?.[0]?.plain_text ?? "?";
      console.error(`    - ${n}`);
    }
    console.error("  Use the full name to match exactly.");
    process.exit(1);
  }
  return response.results[0];
}

async function main() {
  console.log(`\n  Logging lesson for: ${clientName}`);
  console.log(`  ${"─".repeat(40)}`);

  // 1. Find client
  const client = await findClient(clientName);
  if (!client) {
    console.error(`  Client "${clientName}" not found.`);
    process.exit(1);
  }

  const clientPageName = client.properties?.Name?.title?.[0]?.plain_text ?? clientName;
  const currentHoursUsed = client.properties?.["Hours Used"]?.number ?? 0;
  const hoursPurchased = client.properties?.["Hours Purchased"]?.number ?? 0;

  // 2. Create lesson log
  const sessionTitle = `${clientPageName} — ${dateStr}`;
  const lessonProps = {
    Session: { title: [{ text: { content: sessionTitle } }] },
    Client: { relation: [{ id: client.id }] },
    Date: { date: { start: dateStr } },
    Duration: { select: { name: duration } },
    "Hours Charged": { number: hours },
  };

  if (location) {
    lessonProps.Location = { select: { name: location } };
  }

  if (focusAreas.length > 0) {
    lessonProps["Focus Areas"] = {
      multi_select: focusAreas.map((f) => ({ name: f })),
    };
  }

  if (notes) {
    lessonProps["Session Notes"] = {
      rich_text: [{ text: { content: notes } }],
    };
  }

  await notion.pages.create({
    parent: { data_source_id: LESSONS_DB_ID },
    properties: lessonProps,
  });

  console.log(`  Lesson logged: ${sessionTitle}`);

  // 3. Update client hours used
  const newHoursUsed = currentHoursUsed + hours;
  await notion.pages.update({
    page_id: client.id,
    properties: {
      "Hours Used": { number: newHoursUsed },
    },
  });

  console.log(`  Hours updated: ${currentHoursUsed} → ${newHoursUsed} (of ${hoursPurchased} purchased)`);

  // 4. Update skill "Last Worked" dates for focus areas
  if (focusAreas.length > 0) {
    let skillsUpdated = 0;
    for (const focus of focusAreas) {
      const skillResults = await notion.dataSources.query({
        data_source_id: SKILLS_DB_ID,
        filter: {
          and: [
            { property: "Client", relation: { contains: client.id } },
            { property: "Skill", title: { contains: focus } },
          ],
        },
        page_size: 5,
      });

      for (const skill of skillResults.results) {
        await notion.pages.update({
          page_id: skill.id,
          properties: {
            "Last Worked": { date: { start: dateStr } },
          },
        });
        skillsUpdated++;
      }
    }
    console.log(`  Skills updated: ${skillsUpdated} "Last Worked" dates set to ${dateStr}`);
  }

  // 5. Summary
  const remaining = hoursPurchased - newHoursUsed;
  console.log(`\n  SUMMARY`);
  console.log(`  ${"─".repeat(40)}`);
  console.log(`  Client:        ${clientPageName}`);
  console.log(`  Date:          ${dateStr}`);
  console.log(`  Duration:      ${duration}`);
  if (location) console.log(`  Location:      ${location}`);
  if (focusAreas.length > 0) console.log(`  Focus:         ${focusAreas.join(", ")}`);
  if (notes) console.log(`  Notes:         ${notes}`);
  console.log(`  Hours charged: ${hours}`);
  console.log(`  Remaining:     ${remaining} hours`);
  if (remaining <= 1 && remaining >= 0) {
    console.log(`\n  ⚠ Low hours — only ${remaining} remaining!`);
  }
  if (remaining < 0) {
    console.log(`\n  ⚠ Over budget — ${Math.abs(remaining)} hours over purchased amount!`);
  }
  console.log();
}

main().catch((err) => {
  console.error("Lesson logging failed:", err.message);
  process.exit(1);
});
