#!/usr/bin/env node
/**
 * Create a new coaching client with skill progression template
 *
 * Usage:
 *   node --env-file=.env.local scripts/coaching-client.js "Name" email@example.com 3.5 [hours]
 *
 * Arguments:
 *   name         — required
 *   email        — required
 *   skill level  — required (2.0-5.0)
 *   hours        — optional, default 0
 */

import { Client } from "@notionhq/client";

const NOTION_API_KEY = process.env.NOTION_API_KEY?.trim();
const CLIENTS_DB_ID = process.env.NOTION_COACHING_CLIENTS_DB_ID?.trim();
const SKILLS_DB_ID = process.env.NOTION_COACHING_SKILLS_DB_ID?.trim();
const LEADS_DB_ID = process.env.NOTION_LEADS_DB_ID?.trim();

if (!NOTION_API_KEY || !CLIENTS_DB_ID || !SKILLS_DB_ID) {
  console.error("Missing env vars. Need: NOTION_API_KEY, NOTION_COACHING_CLIENTS_DB_ID, NOTION_COACHING_SKILLS_DB_ID");
  console.error("Run scripts/setup-coaching-db.js first to create databases.");
  process.exit(1);
}

const [, , name, email, skillLevel, hoursArg] = process.argv;

if (!name || !email || !skillLevel) {
  console.error("Usage: node --env-file=.env.local scripts/coaching-client.js \"Name\" email@example.com 3.5 [hours]");
  process.exit(1);
}

const validLevels = ["2.0", "2.5", "3.0", "3.5", "4.0", "4.5", "5.0"];
if (!validLevels.includes(skillLevel)) {
  console.error(`Invalid skill level "${skillLevel}". Must be one of: ${validLevels.join(", ")}`);
  process.exit(1);
}

const hoursPurchased = hoursArg ? Number(hoursArg) : 0;

const DEFAULT_SKILLS = [
  { skill: "Serve placement", category: "Serves" },
  { skill: "Serve power", category: "Serves" },
  { skill: "Serve variety", category: "Serves" },
  { skill: "Deep return", category: "Returns" },
  { skill: "Drop return", category: "Returns" },
  { skill: "Drive return", category: "Returns" },
  { skill: "Cross-court dink", category: "Dinks" },
  { skill: "Dink placement", category: "Dinks" },
  { skill: "Speed-up from dink", category: "Dinks" },
  { skill: "Third shot drop", category: "Drops" },
  { skill: "Transition zone drop", category: "Drops" },
  { skill: "Reset drop", category: "Drops" },
  { skill: "Punch volley", category: "Volleys" },
  { skill: "Roll volley", category: "Volleys" },
  { skill: "Erne/ATP", category: "Volleys" },
  { skill: "Offensive lob", category: "Lobs" },
  { skill: "Defensive lob", category: "Lobs" },
  { skill: "Forehand drive", category: "Drives" },
  { skill: "Backhand drive", category: "Drives" },
  { skill: "Stacking", category: "Positioning" },
  { skill: "Transition zone movement", category: "Positioning" },
  { skill: "Court coverage", category: "Positioning" },
  { skill: "Pattern play", category: "Strategy" },
  { skill: "Poaching", category: "Strategy" },
  { skill: "Shot selection", category: "Mental" },
  { skill: "Pace control", category: "Mental" },
  { skill: "Recovery after errors", category: "Mental" },
];

const notion = new Client({ auth: NOTION_API_KEY });

async function main() {
  console.log(`\n  Creating coaching client: ${name}`);
  console.log(`  ${"─".repeat(40)}`);

  // 1. Create client page
  const clientPage = await notion.pages.create({
    parent: { data_source_id: CLIENTS_DB_ID },
    properties: {
      Name: { title: [{ text: { content: name } }] },
      Email: { email: email },
      "Skill Level": { select: { name: skillLevel } },
      "Hours Purchased": { number: hoursPurchased },
      "Hours Used": { number: 0 },
      Status: { select: { name: hoursPurchased > 0 ? "Active" : "Trial" } },
      Source: { select: { name: "Website" } },
      Created: { date: { start: new Date().toISOString().split("T")[0] } },
    },
  });

  console.log(`  Client created: ${clientPage.id}`);

  // 2. Create skill progression rows (batch in groups of 5 to respect rate limits)
  let skillCount = 0;
  const batchSize = 5;
  for (let i = 0; i < DEFAULT_SKILLS.length; i += batchSize) {
    const batch = DEFAULT_SKILLS.slice(i, i + batchSize);
    await Promise.all(
      batch.map((s) =>
        notion.pages.create({
          parent: { data_source_id: SKILLS_DB_ID },
          properties: {
            Skill: { title: [{ text: { content: s.skill } }] },
            Client: { relation: [{ id: clientPage.id }] },
            Category: { select: { name: s.category } },
            Level: { select: { name: "Introduced" } },
          },
        })
      )
    );
    skillCount += batch.length;
  }

  console.log(`  Skills created: ${skillCount} progression rows`);

  // 3. Check if email exists in Leads DB
  if (LEADS_DB_ID) {
    try {
      const leads = await notion.dataSources.query({
        data_source_id: LEADS_DB_ID,
        filter: { property: "Email", email: { equals: email } },
        page_size: 1,
      });
      if (leads.results.length > 0) {
        console.log(`  Linked to existing lead: ${leads.results[0].id}`);
      }
    } catch {
      // Leads DB check is optional — don't fail if it errors
    }
  }

  // 4. Summary
  console.log(`\n  SUMMARY`);
  console.log(`  ${"─".repeat(40)}`);
  console.log(`  Name:          ${name}`);
  console.log(`  Email:         ${email}`);
  console.log(`  Skill Level:   ${skillLevel}`);
  console.log(`  Hours:         ${hoursPurchased}`);
  console.log(`  Status:        ${hoursPurchased > 0 ? "Active" : "Trial"}`);
  console.log(`  Skills:        ${skillCount} tracked`);
  console.log();
}

main().catch((err) => {
  console.error("Client creation failed:", err.message);
  process.exit(1);
});
