import { Client } from "@notionhq/client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { name, email, interest } = await request.json();

    if (!name || !email || !interest) {
      return NextResponse.json(
        { error: "Name, email, and interest are required" },
        { status: 400 }
      );
    }

    // Only connect to Notion if credentials are configured
    const apiKey = process.env.NOTION_API_KEY;
    const dbId = process.env.NOTION_LEADS_DB_ID;

    if (!apiKey || !dbId || apiKey === "your_notion_api_key_here") {
      // In development without Notion configured, just log and succeed
      console.log("Lead received (Notion not configured):", { name, email, interest });
      return NextResponse.json({ success: true });
    }

    const notion = new Client({ auth: apiKey });

    await notion.pages.create({
      parent: { database_id: dbId },
      properties: {
        Name: { title: [{ text: { content: name } }] },
        Email: { email: email },
        Interest: { select: { name: interest } },
        Status: { select: { name: "New" } },
        "Date Submitted": { date: { start: new Date().toISOString() } },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Lead submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit lead" },
      { status: 500 }
    );
  }
}
