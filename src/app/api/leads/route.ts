import { Client } from "@notionhq/client";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { generateEmailDraft } from "@/lib/emailTemplates";

async function checkLndMembership(email: string): Promise<boolean> {
  const url = process.env.LND_SUPABASE_URL;
  const key = process.env.LND_SUPABASE_SERVICE_KEY;
  if (!url || !key) return false;

  const supabase = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Use admin API to search for user by email (service role required)
  const { data, error } = await supabase.auth.admin.listUsers({ perPage: 1000 });
  if (error || !data?.users) return false;

  return data.users.some(
    (u) => u.email?.toLowerCase() === email.toLowerCase()
  );
}

async function createEmailDraft(
  notion: Client,
  name: string,
  email: string,
  interest: string,
  isLndMember: boolean
): Promise<void> {
  const draftsDbId = process.env.NOTION_DRAFTS_DB_ID;
  if (!draftsDbId) return;

  const emailBody = generateEmailDraft(interest, name, isLndMember);

  // Split email body into paragraph blocks for Notion page content
  const paragraphs = emailBody.split("\n\n").map((paragraph) => ({
    object: "block" as const,
    type: "paragraph" as const,
    paragraph: {
      rich_text: [{ type: "text" as const, text: { content: paragraph } }],
    },
  }));

  await notion.pages.create({
    parent: { database_id: draftsDbId },
    properties: {
      Name: { title: [{ text: { content: name } }] },
      Email: { email: email },
      Interest: { select: { name: interest } },
      "L&D Member": { checkbox: isLndMember },
      Created: { date: { start: new Date().toISOString() } },
      Status: { select: { name: "Draft" } },
    },
    children: paragraphs,
  });
}

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

    // Generate email draft — isolated so lead creation never fails
    try {
      const isLndMember = await checkLndMembership(email);
      await createEmailDraft(notion, name, email, interest, isLndMember);
    } catch (draftError) {
      console.error("Email draft creation failed (lead still saved):", draftError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Lead submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit lead" },
      { status: 500 }
    );
  }
}
