import { Client } from "@notionhq/client";
import { NextResponse } from "next/server";
import { LESSON_STATUS } from "@/lib/lessons";

export const dynamic = "force-dynamic";

/**
 * Player confirms the lesson Sam proposed. Flips the lead to "Confirmed" and
 * clears the single-use token. The fulfillment job picks up Confirmed leads
 * and sends the Stripe invoice + calendar invite.
 */
export async function POST(request: Request) {
  let token: string | undefined;
  try {
    token = (await request.json()).token;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!token || typeof token !== "string") {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
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
    const res: any = await notion.dataSources.query({
      data_source_id: dbId,
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

    const props = page.properties as Record<string, unknown>;
    const confirmBy =
      (props["Confirm By"] as { date?: { start?: string } })?.date?.start ?? "";
    if (!confirmBy || new Date(confirmBy).getTime() < Date.now()) {
      return NextResponse.json(
        { error: "This link has expired" },
        { status: 410 }
      );
    }
    const startIso =
      (props["Lesson Date"] as { date?: { start?: string } })?.date?.start ??
      "";
    if (!startIso || new Date(startIso).getTime() <= Date.now()) {
      return NextResponse.json(
        { error: "This lesson time has already passed" },
        { status: 410 }
      );
    }

    pageId = page.id;
  } catch (err) {
    console.error("confirm: lookup failed", err);
    return NextResponse.json(
      { error: "Confirmation failed, please try again" },
      { status: 500 }
    );
  }

  if (!pageId) {
    return NextResponse.json(
      { error: "Confirmation failed, please try again" },
      { status: 500 }
    );
  }

  try {
    await notion.pages.update({
      page_id: pageId,
      properties: {
        Status: { select: { name: LESSON_STATUS.CONFIRMED } },
        "Confirm Token": { rich_text: [] },
      },
    });
  } catch (err) {
    console.error("confirm: update failed", err);
    return NextResponse.json(
      { error: "Confirmation failed, please try again" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
