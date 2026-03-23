#!/usr/bin/env node
/**
 * One-time Coaching CRM Database Setup
 *
 * Creates 3 Notion databases under a parent page:
 *   - Coaching Clients
 *   - Skill Progression
 *   - Lesson Log
 *
 * Usage:
 *   node --env-file=.env.local scripts/setup-coaching-db.js
 *
 * Requires:
 *   NOTION_API_KEY
 *   NOTION_COACHING_PARENT_PAGE_ID — the Notion page where coaching databases live
 */

import { Client } from "@notionhq/client";

const NOTION_API_KEY = process.env.NOTION_API_KEY?.trim();
const PARENT_PAGE_ID = process.env.NOTION_COACHING_PARENT_PAGE_ID?.trim();

if (!NOTION_API_KEY) {
  console.error("Missing NOTION_API_KEY in .env.local");
  process.exit(1);
}
if (!PARENT_PAGE_ID) {
  console.error("Missing NOTION_COACHING_PARENT_PAGE_ID in .env.local");
  console.error("Set it to the Notion page ID where coaching databases should be created.");
  process.exit(1);
}

const notion = new Client({ auth: NOTION_API_KEY });

async function createDatabase(title, properties) {
  const result = await notion.databases.create({
    parent: { type: "page_id", page_id: PARENT_PAGE_ID },
    title: [{ text: { content: title } }],
    is_inline: true,
    initial_data_source: { properties },
  });

  // The database returns data_sources array; we need the data_source_id for queries/pages
  const dsId = result.data_sources?.[0]?.id ?? result.id;
  console.log(`  Created "${title}" — DB: ${result.id}, DataSource: ${dsId}`);
  return { databaseId: result.id, dataSourceId: dsId };
}

async function main() {
  console.log("\n  COACHING CRM — Database Setup");
  console.log(`  ${"═".repeat(45)}\n`);

  // 1. Coaching Clients
  const clients = await createDatabase("Coaching Clients", {
    Name: { title: {} },
    Email: { email: {} },
    Phone: { phone_number: {} },
    "Skill Level": {
      select: {
        options: [
          { name: "2.0" }, { name: "2.5" }, { name: "3.0" }, { name: "3.5" },
          { name: "4.0" }, { name: "4.5" }, { name: "5.0" },
        ],
      },
    },
    "Hours Purchased": { number: { format: "number" } },
    "Hours Used": { number: { format: "number" } },
    "Next Session": { date: {} },
    Status: {
      select: {
        options: [
          { name: "Active" }, { name: "Paused" }, { name: "Completed" }, { name: "Trial" },
        ],
      },
    },
    Source: {
      select: {
        options: [
          { name: "Website" }, { name: "Referral" }, { name: "Stripe" }, { name: "Walk-in" },
        ],
      },
    },
    "Referred By": { rich_text: {} },
    Notes: { rich_text: {} },
    Created: { date: {} },
  });

  // 2. Skill Progression (linked to Clients via relation)
  const skills = await createDatabase("Skill Progression", {
    Skill: { title: {} },
    Client: {
      relation: {
        data_source_id: clients.dataSourceId,
        single_property: {},
      },
    },
    Category: {
      select: {
        options: [
          { name: "Serves" }, { name: "Returns" }, { name: "Dinks" },
          { name: "Drives" }, { name: "Drops" }, { name: "Volleys" },
          { name: "Lobs" }, { name: "Strategy" }, { name: "Positioning" }, { name: "Mental" },
        ],
      },
    },
    Level: {
      select: {
        options: [
          { name: "Introduced" }, { name: "Drilling" }, { name: "Game-Ready" }, { name: "Mastered" },
        ],
      },
    },
    Notes: { rich_text: {} },
    "Last Worked": { date: {} },
  });

  // 3. Lesson Log (linked to Clients via relation)
  const lessons = await createDatabase("Lesson Log", {
    Session: { title: {} },
    Client: {
      relation: {
        data_source_id: clients.dataSourceId,
        single_property: {},
      },
    },
    Date: { date: {} },
    Duration: {
      select: {
        options: [
          { name: "30min" }, { name: "1hr" }, { name: "1.5hr" }, { name: "2hr" },
        ],
      },
    },
    Location: {
      select: {
        options: [
          { name: "Rockville" }, { name: "North Bethesda" },
        ],
      },
    },
    "Focus Areas": { multi_select: { options: [] } },
    "Session Notes": { rich_text: {} },
    "Hours Charged": { number: { format: "number" } },
  });

  console.log(`\n  ${"─".repeat(45)}`);
  console.log("  Add these to .env.local:\n");
  console.log(`  NOTION_COACHING_CLIENTS_DB_ID=${clients.dataSourceId}`);
  console.log(`  NOTION_COACHING_SKILLS_DB_ID=${skills.dataSourceId}`);
  console.log(`  NOTION_COACHING_LESSONS_DB_ID=${lessons.dataSourceId}`);
  console.log();
}

main().catch((err) => {
  console.error("Setup failed:", err.message);
  process.exit(1);
});
