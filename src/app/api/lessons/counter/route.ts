import { Client } from "@notionhq/client";
import { NextResponse } from "next/server";
import {
  LESSON_STATUS,
  etDateTimeIso,
  formatLessonDateTime,
} from "@/lib/lessons";
import { queryLeads } from "@/lib/notion";

export const dynamic = "force-dynamic";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

/**
 * Player counters Sam's proposed time with a different date/time.
 * Flips the lead to "Countered" and stores the counter; the old link
 * becomes inert (token lookup requires "Awaiting player"). Sam sees the
 * counter in the admin dashboard and re-proposes from it.
 */
export async function POST(request: Request) {
  let body: { token?: string; date?: string; time?: string; note?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { token, date, time, note } = body;
  if (!token || typeof token !== "string") {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }
  if (!date || !DATE_RE.test(date) || !time || !TIME_RE.test(time)) {
    return NextResponse.json(
      { error: "date (YYYY-MM-DD) and time (HH:MM) are required" },
      { status: 400 }
    );
  }
  if (Number(time.slice(3)) % 15 !== 0) {
    return NextResponse.json(
      { error: "time must be on a 15-minute increment (:00, :15, :30, :45)" },
      { status: 400 }
    );
  }
  const startIso = etDateTimeIso(date, time);
  if (new Date(startIso).getTime() <= Date.now()) {
    return NextResponse.json(
      { error: "Counter time must be in the future" },
      { status: 400 }
    );
  }

  const apiKey = process.env.NOTION_API_KEY?.trim();
  const dbId = process.env.NOTION_LEADS_DB_ID?.trim();
  if (!apiKey || !dbId) {
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  const notion = new Client({ auth: apiKey });

  let pageId: string | null = null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res: any = await queryLeads(notion, dbId, {
      filter: {
        and: [
          { property: "Confirm Token", rich_text: { equals: token } },
          {
            property: "Status",
            select: { equals: LESSON_STATUS.AWAITING_PLAYER },
          },
        ],
      },
      page_size: 1,
    });
    const page = res.results?.[0];
    if (!page) {
      return NextResponse.json(
        { error: "This link is invalid, expired, or already used" },
        { status: 404 }
      );
    }
    pageId = page.id;
  } catch (err) {
    console.error("counter: lookup failed", err);
    return NextResponse.json(
      { error: "Could not save your suggestion, please try again" },
      { status: 500 }
    );
  }

  try {
    await notion.pages.update({
      page_id: pageId!,
      properties: {
        Status: { select: { name: LESSON_STATUS.COUNTERED } },
        "Counter Date": { date: { start: startIso } },
        "Counter Note":
          note && note.trim()
            ? { rich_text: [{ text: { content: note.trim().slice(0, 500) } }] }
            : { rich_text: [] },
      },
    });
  } catch (err) {
    console.error("counter: Notion update failed", err);
    return NextResponse.json(
      { error: "Could not save your suggestion, please try again" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    dateLabel: formatLessonDateTime(startIso),
  });
}
