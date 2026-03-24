#!/usr/bin/env node
/**
 * Coaching Calendar Auto-Sync
 *
 * Scans Google Calendar for "Lesson" events and logs any new ones
 * to the Coaching CRM in Notion. Cross-references existing lesson log
 * to avoid duplicates.
 *
 * Usage:
 *   node --env-file=.env.local scripts/coaching-calendar-sync.js [days-back]
 *
 * Requires: GOOGLE_CALENDAR_API not available from CLI directly.
 * This script is designed to be invoked by Claude Code which has
 * Google Calendar MCP access. It outputs structured JSON for the
 * slash command to process.
 */

import { Client } from "@notionhq/client";

const daysBack = Math.min(365, Math.max(1, Number(process.argv[2]) || 30));

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const CLIENTS_DB = process.env.NOTION_COACHING_CLIENTS_DB_ID;
const LESSONS_DB = process.env.NOTION_COACHING_LESSONS_DB_ID;

if (!CLIENTS_DB || !LESSONS_DB) {
  console.error("Missing NOTION_COACHING_CLIENTS_DB_ID or NOTION_COACHING_LESSONS_DB_ID");
  process.exit(1);
}

async function getExistingLessons() {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - daysBack);

  const lessons = [];
  let cursor;
  do {
    const resp = await notion.dataSources.query({
      data_source_id: LESSONS_DB,
      filter: {
        property: "Date",
        date: { on_or_after: cutoff.toISOString().split("T")[0] },
      },
      start_cursor: cursor,
      page_size: 100,
    });
    for (const page of resp.results) {
      const props = page.properties;
      lessons.push({
        session: props.Session?.title?.[0]?.plain_text ?? "",
        date: props.Date?.date?.start ?? "",
        client: props.Session?.title?.[0]?.plain_text?.split(" — ")[0] ?? "",
      });
    }
    cursor = resp.has_more ? resp.next_cursor : undefined;
  } while (cursor);

  return lessons;
}

async function getClients() {
  const clients = [];
  let cursor;
  do {
    const resp = await notion.dataSources.query({
      data_source_id: CLIENTS_DB,
      start_cursor: cursor,
      page_size: 100,
    });
    for (const page of resp.results) {
      const props = page.properties;
      clients.push({
        id: page.id,
        name: props.Name?.title?.[0]?.plain_text ?? "",
      });
    }
    cursor = resp.has_more ? resp.next_cursor : undefined;
  } while (cursor);

  return clients;
}

async function main() {
  const [existingLessons, clients] = await Promise.all([
    getExistingLessons(),
    getClients(),
  ]);

  // Build a set of "clientName|date" for dedup
  const existingKeys = new Set(
    existingLessons.map((l) => `${l.client.toLowerCase()}|${l.date}`)
  );

  console.log(
    JSON.stringify({
      mode: "sync-check",
      daysBack,
      existingLessons: existingLessons.length,
      existingKeys: Array.from(existingKeys),
      clients: clients.map((c) => c.name),
      clientIds: Object.fromEntries(clients.map((c) => [c.name.toLowerCase(), c.id])),
    })
  );
}

main().catch((err) => {
  console.error("Calendar sync failed:", err.message);
  process.exit(1);
});
