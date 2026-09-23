import { Client } from "@notionhq/client";
import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { lessonConfirmRequestEmail } from "@/lib/emailTemplates";
import {
  CONFIRM_WINDOW_DAYS,
  LESSON_INTERESTS,
  LESSON_STATUS,
  buildConfirmUrl,
  confirmByDate,
  etDateTimeIso,
  formatAmountDollars,
  formatLessonDateTime,
  generateConfirmToken,
  lessonAmountCents,
  lessonTitle,
} from "@/lib/lessons";

export const dynamic = "force-dynamic";

function validateAuth(request: Request): boolean {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  return Boolean(token) && token === process.env.ADMIN_PASSWORD;
}

function getNotionConfig() {
  const apiKey = process.env.NOTION_API_KEY?.trim();
  const dbId = process.env.NOTION_LEADS_DB_ID?.trim();
  if (!apiKey || !dbId) return null;
  return { apiKey, dbId };
}

function plainText(prop: unknown): string {
  if (!prop || typeof prop !== "object") return "";
  const p = prop as { type?: string; title?: { plain_text: string }[]; rich_text?: { plain_text: string }[]; email?: string; select?: { name: string } | null };
  if (p.type === "title") return (p.title ?? []).map((t) => t.plain_text).join("");
  if (p.type === "rich_text") return (p.rich_text ?? []).map((t) => t.plain_text).join("");
  if (p.type === "email") return p.email ?? "";
  if (p.type === "select") return p.select?.name ?? "";
  return "";
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
const VALID_DURATIONS = [30, 60, 90, 120];

/**
 * Sam proposes a time/location for a lesson lead. Stores the proposal on the
 * Notion lead, flips status to "Awaiting player", and emails the player a
 * confirm link. Confirming triggers invoice + calendar invite via fulfillment.
 */
export async function POST(request: Request) {
  if (!validateAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const config = getNotionConfig();
  if (!config) {
    return NextResponse.json({ error: "Notion not configured" }, { status: 500 });
  }

  let body: {
    pageId?: string;
    date?: string;
    time?: string;
    location?: string;
    durationMin?: number;
    additionalPlayers?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { pageId, date, time, location, durationMin, additionalPlayers } = body;

  if (!pageId || typeof pageId !== "string") {
    return NextResponse.json({ error: "Missing pageId" }, { status: 400 });
  }
  if (!date || !DATE_RE.test(date) || !time || !TIME_RE.test(time)) {
    return NextResponse.json(
      { error: "date (YYYY-MM-DD) and time (HH:MM) are required" },
      { status: 400 }
    );
  }
  if (!location || !location.trim()) {
    return NextResponse.json({ error: "location is required" }, { status: 400 });
  }
  const duration = Number(durationMin) || 60;
  if (!VALID_DURATIONS.includes(duration)) {
    return NextResponse.json(
      { error: `durationMin must be one of ${VALID_DURATIONS.join(", ")}` },
      { status: 400 }
    );
  }

  const startIso = etDateTimeIso(date, time);
  if (new Date(startIso).getTime() <= Date.now()) {
    return NextResponse.json(
      { error: "Lesson must be scheduled in the future" },
      { status: 400 }
    );
  }

  const notion = new Client({ auth: config.apiKey });

  let page;
  try {
    const res = await notion.pages.retrieve({ page_id: pageId });
    if (res.object !== "page" || !("properties" in res)) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }
    page = res;
  } catch {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  const props = page.properties as Record<string, unknown>;
  const name = plainText(props["Name"]) || "there";
  const email = plainText(props["Email"]);
  const interest = plainText(props["Interest"]);

  if (!email) {
    return NextResponse.json(
      { error: "Lead has no email address" },
      { status: 400 }
    );
  }
  if (!(LESSON_INTERESTS as readonly string[]).includes(interest)) {
    return NextResponse.json(
      { error: `Interest "${interest}" is not a lesson type` },
      { status: 400 }
    );
  }

  const extraNames = (additionalPlayers ?? "")
    .split(",")
    .map((n) => n.trim())
    .filter(Boolean);
  const title = lessonTitle(interest, [name, ...extraNames]);
  const token = generateConfirmToken();
  const confirmUrl = buildConfirmUrl(token);
  const amountCents = lessonAmountCents(duration);
  const dateLabel = formatLessonDateTime(startIso);

  try {
    await notion.pages.update({
      page_id: pageId,
      properties: {
        "Lesson Date": { date: { start: startIso } },
        "Lesson Location": { rich_text: [{ text: { content: location.trim() } }] },
        "Lesson Duration (min)": { number: duration },
        "Additional Players": {
          rich_text: [{ text: { content: extraNames.join(", ") } }],
        },
        "Confirm Token": { rich_text: [{ text: { content: token } }] },
        "Confirm By": { date: { start: confirmByDate().toISOString() } },
        "Invoice Sent": { checkbox: false },
        "Stripe Invoice URL": { url: null },
        "Calendar Event ID": { rich_text: [] },
        Status: { select: { name: LESSON_STATUS.AWAITING_PLAYER } },
      },
    });
  } catch (err) {
    console.error("propose: Notion update failed", err);
    return NextResponse.json(
      { error: "Failed to save proposal" },
      { status: 500 }
    );
  }

  const { subject, body: emailBody } = lessonConfirmRequestEmail({
    name,
    title,
    dateLabel,
    location: location.trim(),
    durationMin: duration,
    amountLabel: formatAmountDollars(amountCents),
    confirmUrl,
    confirmWindowDays: CONFIRM_WINDOW_DAYS,
  });

  const sent = await sendEmail(email, subject, emailBody);
  if (!sent.success) {
    console.error("propose: confirm email failed", sent.error);
    return NextResponse.json(
      { error: "Proposal saved but confirm email failed to send" },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true, confirmUrl, title, dateLabel });
}
