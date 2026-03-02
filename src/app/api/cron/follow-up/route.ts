import { Client } from "@notionhq/client";
import { NextResponse } from "next/server";
import { notifySam } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // Verify cron secret (Vercel sends this automatically)
  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token || token !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.NOTION_API_KEY?.trim();
  const dbId = process.env.NOTION_LEADS_DB_ID?.trim();

  if (!apiKey || !dbId) {
    return NextResponse.json({ error: "Notion not configured" }, { status: 500 });
  }

  try {
    const notion = new Client({ auth: apiKey });
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    // Query leads that are still "New" and older than 2 days
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await notion.dataSources.query({
      data_source_id: dbId,
      filter: {
        and: [
          { property: "Status", select: { equals: "New" } },
          { property: "Date Submitted", date: { before: twoDaysAgo.toISOString() } },
        ],
      },
      sorts: [{ property: "Date Submitted", direction: "ascending" }],
    });

    const staleLeads = response.results ?? [];

    if (staleLeads.length === 0) {
      return NextResponse.json({ message: "No stale leads", count: 0 });
    }

    // Build reminder email
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lines = staleLeads.map((page: any) => {
      const props = page.properties;
      const name = props.Name?.title?.[0]?.plain_text ?? "Unknown";
      const email = props.Email?.email ?? "—";
      const interest = props.Interest?.select?.name ?? "—";
      const submitted = props["Date Submitted"]?.date?.start ?? "";
      const daysAgo = submitted
        ? Math.floor((Date.now() - new Date(submitted).getTime()) / 86400000)
        : "?";
      return `- ${name} (${email}) — ${interest} — ${daysAgo} days ago`;
    });

    await notifySam(
      `Follow-Up Reminder: ${staleLeads.length} stale lead${staleLeads.length > 1 ? "s" : ""}`,
      `The following leads are still marked "New" and haven't been contacted:\n\n${lines.join("\n")}\n\nReview them at: https://www.sammorrispb.com/admin`
    );

    return NextResponse.json({ message: "Reminder sent", count: staleLeads.length });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("Follow-up cron error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
