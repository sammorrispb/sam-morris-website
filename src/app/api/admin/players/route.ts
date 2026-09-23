import { Client } from "@notionhq/client";
import { NextResponse } from "next/server";
import { getDataSourceId } from "@/lib/notion";
import {
  PLAYER_LEVELS,
  isPlayerLevel,
  isValidEmail,
  mapClientPage,
} from "@/lib/players";
import { findClientByEmail, upsertCoachingClient } from "@/lib/coaching-crm";

export const dynamic = "force-dynamic";

function validateAuth(request: Request): boolean {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  return Boolean(token) && token === process.env.ADMIN_PASSWORD;
}

function getNotionConfig() {
  const apiKey = process.env.NOTION_API_KEY?.trim();
  const dbId = process.env.NOTION_COACHING_CLIENTS_DB_ID?.trim();
  if (!apiKey || !dbId) return null;
  return { apiKey, dbId };
}

/**
 * GET /api/admin/players — list coaching clients (the players CRM).
 * Query params: search (name or email), level, cursor, pageSize.
 */
export async function GET(request: Request) {
  if (!validateAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const config = getNotionConfig();
  if (!config) {
    return NextResponse.json(
      { error: "Players CRM not configured" },
      { status: 500 }
    );
  }

  const url = new URL(request.url);
  const search = url.searchParams.get("search") ?? "";
  const levelFilter = url.searchParams.get("level") ?? "";
  const cursorParam = url.searchParams.get("cursor") ?? undefined;
  const pageSize = Math.min(
    100,
    Math.max(10, Number(url.searchParams.get("pageSize")) || 25)
  );

  if (levelFilter && !isPlayerLevel(levelFilter)) {
    return NextResponse.json({ error: "Invalid level" }, { status: 400 });
  }

  try {
    const notion = new Client({ auth: config.apiKey });
    const dataSourceId = await getDataSourceId(notion, config.dbId);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const conditions: any[] = [];
    if (levelFilter) {
      conditions.push({
        property: "Skill Level",
        select: { equals: levelFilter },
      });
    }
    if (search) {
      conditions.push({
        or: [
          { property: "Name", title: { contains: search } },
          { property: "Email", email: { contains: search } },
        ],
      });
    }
    const filter =
      conditions.length > 1
        ? { and: conditions }
        : conditions.length === 1
          ? conditions[0]
          : undefined;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await notion.dataSources.query({
      data_source_id: dataSourceId,
      sorts: [{ property: "Created", direction: "descending" }],
      ...(filter && { filter }),
      ...(cursorParam && { start_cursor: cursorParam }),
      page_size: pageSize,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const players = response.results.map((page: any) => mapClientPage(page));

    // Total count (players are few; one light scan is fine — Notion has
    // no count endpoint).
    let total = 0;
    let scanCursor: string | undefined;
    do {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const scan: any = await notion.dataSources.query({
        data_source_id: dataSourceId,
        page_size: 100,
        start_cursor: scanCursor,
      });
      total += scan.results?.length ?? 0;
      scanCursor = scan.has_more ? (scan.next_cursor ?? undefined) : undefined;
    } while (scanCursor);

    return NextResponse.json({
      total,
      levels: PLAYER_LEVELS,
      players,
      hasMore: response.has_more ?? false,
      nextCursor: response.next_cursor ?? null,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("Admin players GET error:", msg);
    return NextResponse.json(
      { error: `Failed to fetch players: ${msg}` },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/players — update a player's level and/or notes.
 * Body: { pageId, level?, notes? }
 */
export async function PATCH(request: Request) {
  if (!validateAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const config = getNotionConfig();
  if (!config) {
    return NextResponse.json(
      { error: "Players CRM not configured" },
      { status: 500 }
    );
  }

  let body: { pageId?: string; level?: string; notes?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { pageId, level, notes } = body;
  if (!pageId || typeof pageId !== "string") {
    return NextResponse.json({ error: "Missing pageId" }, { status: 400 });
  }
  if (level !== undefined && !isPlayerLevel(level)) {
    return NextResponse.json(
      { error: `Invalid level. Must be one of: ${PLAYER_LEVELS.join(", ")}` },
      { status: 400 }
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const properties: Record<string, any> = {};
  if (level !== undefined) {
    properties["Skill Level"] = { select: { name: level } };
  }
  if (notes !== undefined) {
    properties["Notes"] = {
      rich_text: notes ? [{ text: { content: notes.slice(0, 2000) } }] : [],
    };
  }
  if (Object.keys(properties).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  try {
    const notion = new Client({ auth: config.apiKey });
    await notion.pages.update({ page_id: pageId, properties });
    return NextResponse.json({ success: true });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("Admin players PATCH error:", msg);
    return NextResponse.json(
      { error: `Failed to update player: ${msg}` },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/players — add a player manually.
 * Body: { name, email, level? }
 */
export async function POST(request: Request) {
  if (!validateAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const config = getNotionConfig();
  if (!config) {
    return NextResponse.json(
      { error: "Players CRM not configured" },
      { status: 500 }
    );
  }

  let body: { name?: string; email?: string; level?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim().toLowerCase() ?? "";
  const level = body.level ?? "";

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
  }
  if (level && !isPlayerLevel(level)) {
    return NextResponse.json(
      { error: `Invalid level. Must be one of: ${PLAYER_LEVELS.join(", ")}` },
      { status: 400 }
    );
  }

  try {
    const notion = new Client({ auth: config.apiKey });
    const existing = await findClientByEmail(notion, config.dbId, email);
    if (existing) {
      return NextResponse.json(
        { error: "A player with this email already exists" },
        { status: 409 }
      );
    }

    const { clientPageId } = await upsertCoachingClient(
      notion,
      config.dbId,
      { name, email, source: "Manual", skillLevel: level || undefined }
    );
    const page = await notion.pages.retrieve({ page_id: clientPageId });
    return NextResponse.json({ player: mapClientPage(page) }, { status: 201 });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("Admin players POST error:", msg);
    return NextResponse.json(
      { error: `Failed to add player: ${msg}` },
      { status: 500 }
    );
  }
}
