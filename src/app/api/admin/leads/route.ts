import { Client } from "@notionhq/client";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Validate Bearer token
  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token || token !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.NOTION_API_KEY;
  const dbId = process.env.NOTION_LEADS_DB_ID;

  if (!apiKey || !dbId) {
    return NextResponse.json(
      { error: "Notion not configured" },
      { status: 500 }
    );
  }

  try {
    const notion = new Client({ auth: apiKey });

    // Paginate through all results
    const allPages: Record<string, unknown>[] = [];
    let cursor: string | undefined;

    do {
      const response: { results: Record<string, unknown>[]; has_more: boolean; next_cursor: string | null } = await notion.dataSources.query({
        data_source_id: dbId,
        sorts: [{ property: "Date Submitted", direction: "descending" }],
        start_cursor: cursor,
        page_size: 100,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }) as any;

      allPages.push(...response.results);
      cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined;
    } while (cursor);

    // Compute aggregates
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    let recentCount = 0;
    const interestCounts: Record<string, number> = {};

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const leads = allPages.map((page: any) => {
      const props = page.properties;
      const name = props.Name?.title?.[0]?.plain_text ?? "";
      const email = props.Email?.email ?? "";
      const interest = props.Interest?.select?.name ?? "";
      const status = props.Status?.select?.name ?? "";
      const dateSubmitted = props["Date Submitted"]?.date?.start ?? "";

      if (interest) {
        interestCounts[interest] = (interestCounts[interest] || 0) + 1;
      }

      if (dateSubmitted && new Date(dateSubmitted) >= sevenDaysAgo) {
        recentCount++;
      }

      return { name, email, interest, status, dateSubmitted };
    });

    const interestBreakdown = Object.entries(interestCounts)
      .map(([interest, count]) => ({ interest, count }))
      .sort((a, b) => b.count - a.count);

    return NextResponse.json({
      total: leads.length,
      recentCount,
      interestBreakdown,
      leads: leads.slice(0, 50),
    });
  } catch (error) {
    console.error("Admin leads error:", error);
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}
