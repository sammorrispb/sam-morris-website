import { Client } from "@notionhq/client";
import { NextResponse } from "next/server";

const VALID_STATUSES = ["New", "Contacted", "Converted", "Paid"] as const;

function validateAuth(request: Request): string | null {
  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.replace("Bearer ", "");
  if (!token || token !== process.env.ADMIN_PASSWORD) return null;
  return token;
}

function getNotionConfig() {
  const apiKey = process.env.NOTION_API_KEY?.trim();
  const dbId = process.env.NOTION_LEADS_DB_ID?.trim();
  if (!apiKey || !dbId) return null;
  return { apiKey, dbId };
}

export async function GET(request: Request) {
  if (!validateAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const config = getNotionConfig();
  if (!config) {
    return NextResponse.json({ error: "Notion not configured" }, { status: 500 });
  }

  const url = new URL(request.url);
  const search = url.searchParams.get("search") ?? "";
  const statusFilter = url.searchParams.get("status") ?? "";
  const interestFilter = url.searchParams.get("interest") ?? "";
  const sourceFilter = url.searchParams.get("source") ?? "";
  const cursorParam = url.searchParams.get("cursor") ?? undefined;
  const pageSize = Math.min(100, Math.max(10, Number(url.searchParams.get("pageSize")) || 25));

  try {
    const notion = new Client({ auth: config.apiKey });

    // --- Stats query: iterate all pages (unfiltered) for global counts ---
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allPages: any[] = [];
    let statsCursor: string | undefined;

    do {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await notion.dataSources.query({
        data_source_id: config.dbId,
        sorts: [{ property: "Date Submitted", direction: "descending" }],
        start_cursor: statsCursor,
        page_size: 100,
      });

      allPages.push(...response.results);
      statsCursor = response.has_more ? (response.next_cursor ?? undefined) : undefined;
    } while (statsCursor);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    let recentCount = 0;
    let paidCount = 0;
    let attentionCount = 0;
    const interestCounts: Record<string, number> = {};

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const page of allPages) {
      const props = page.properties;
      const interest = props.Interest?.select?.name ?? "";
      const status = props.Status?.select?.name ?? "";
      const dateSubmitted = props["Date Submitted"]?.date?.start ?? "";
      const emailSent = props["Email Sent"]?.checkbox ?? false;

      if (interest) {
        interestCounts[interest] = (interestCounts[interest] || 0) + 1;
      }

      if (dateSubmitted && new Date(dateSubmitted) >= sevenDaysAgo) {
        recentCount++;
      }

      if (status === "Paid") {
        paidCount++;
      }

      // Attention flags — same thresholds as follow-up cron
      if (dateSubmitted) {
        const submittedDate = new Date(dateSubmitted);
        const daysOld = (Date.now() - submittedDate.getTime()) / 86400000;
        if (status === "Paid" && !emailSent) attentionCount++;
        else if (status === "New" && daysOld > 2) attentionCount++;
        else if (!emailSent && daysOld > 1) attentionCount++;
      }
    }

    const interestBreakdown = Object.entries(interestCounts)
      .map(([interest, count]) => ({ interest, count }))
      .sort((a, b) => b.count - a.count);

    // --- Leads query: single filtered + paginated call ---
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const conditions: any[] = [];

    if (statusFilter) {
      conditions.push({ property: "Status", select: { equals: statusFilter } });
    }
    if (interestFilter) {
      conditions.push({ property: "Interest", select: { equals: interestFilter } });
    }
    if (sourceFilter) {
      conditions.push({ property: "Source", select: { equals: sourceFilter } });
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
    const leadsResponse: any = await notion.dataSources.query({
      data_source_id: config.dbId,
      sorts: [{ property: "Date Submitted", direction: "descending" }],
      ...(filter && { filter }),
      ...(cursorParam && { start_cursor: cursorParam }),
      page_size: pageSize,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const leads = leadsResponse.results.map((page: any) => {
      const props = page.properties;
      return {
        id: page.id,
        name: props.Name?.title?.[0]?.plain_text ?? "",
        email: props.Email?.email ?? "",
        interest: props.Interest?.select?.name ?? "",
        status: props.Status?.select?.name ?? "",
        dateSubmitted: props["Date Submitted"]?.date?.start ?? "",
        source: props.Source?.select?.name ?? "Website",
        emailSent: props["Email Sent"]?.checkbox ?? false,
      };
    });

    return NextResponse.json({
      total: allPages.length,
      recentCount,
      paidCount,
      attentionCount,
      interestBreakdown,
      leads,
      hasMore: leadsResponse.has_more ?? false,
      nextCursor: leadsResponse.next_cursor ?? null,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("Admin leads error:", msg);
    return NextResponse.json(
      { error: `Failed to fetch leads: ${msg}` },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  if (!validateAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const config = getNotionConfig();
  if (!config) {
    return NextResponse.json({ error: "Notion not configured" }, { status: 500 });
  }

  try {
    const { pageId, status } = await request.json();

    if (!pageId || typeof pageId !== "string") {
      return NextResponse.json({ error: "Missing pageId" }, { status: 400 });
    }

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` },
        { status: 400 }
      );
    }

    const notion = new Client({ auth: config.apiKey });

    await notion.pages.update({
      page_id: pageId,
      properties: {
        Status: { select: { name: status } },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("Admin leads PATCH error:", msg);
    return NextResponse.json(
      { error: `Failed to update status: ${msg}` },
      { status: 500 }
    );
  }
}
