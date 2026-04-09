import { Client } from "@notionhq/client";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { generateEmailDraft } from "@/lib/emailTemplates";
import { sendEmail, notifySam } from "@/lib/email";
import { ingestToOpenBrain } from "@/lib/open-brain-ingest";

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
  const draftsDbId = process.env.NOTION_DRAFTS_DB_ID?.trim();
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
    parent: { data_source_id: draftsDbId },
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    // Only connect to Notion if credentials are configured
    const apiKey = process.env.NOTION_API_KEY?.trim();
    const dbId = process.env.NOTION_LEADS_DB_ID?.trim();

    if (!apiKey || !dbId || apiKey === "your_notion_api_key_here") {
      // In development without Notion configured, just log and succeed
      console.log("Lead received (Notion not configured):", { name, email, interest });
      return NextResponse.json({ success: true });
    }

    const notion = new Client({ auth: apiKey });

    const leadPage = await notion.pages.create({
      parent: { data_source_id: dbId },
      properties: {
        Name: { title: [{ text: { content: name } }] },
        Email: { email: email },
        Interest: { select: { name: interest } },
        Status: { select: { name: "New" } },
        Source: { select: { name: "Website" } },
        "Date Submitted": { date: { start: new Date().toISOString() } },
        "Drip Step": { number: 0 },
        "Drip Opted Out": { checkbox: interest === "Business Partnerships" },
      },
    });

    // Check L&D membership once — used by draft and welcome email
    let isLndMember = false;
    try {
      isLndMember = await checkLndMembership(email);
    } catch {
      console.error("L&D membership check failed, defaulting to false");
    }

    // Generate email draft — isolated so lead creation never fails
    try {
      await createEmailDraft(notion, name, email, interest, isLndMember);
    } catch (draftError) {
      console.error("Email draft creation failed (lead still saved):", draftError);
    }

    // Notify Sam about the new lead
    try {
      await notifySam(
        `New Lead: ${name} — ${interest}`,
        `Name: ${name}\nEmail: ${email}\nInterest: ${interest}\nL&D Member: ${isLndMember ? "Yes" : "No"}\nSubmitted: ${new Date().toLocaleString("en-US", { timeZone: "America/New_York" })}`
      );
    } catch (notifyError) {
      console.error("Lead notification email failed:", notifyError);
    }

    // Send welcome email to the lead
    try {
      const emailBody = generateEmailDraft(interest, name, isLndMember);
      const result = await sendEmail(
        email,
        `Thanks for reaching out, ${name}!`,
        emailBody
      );

      // Mark as sent in Notion
      if (result.success && leadPage) {
        try {
          await notion.pages.update({
            page_id: leadPage.id,
            properties: {
              "Email Sent": { checkbox: true },
            },
          });
        } catch (updateError) {
          console.error("Failed to mark Email Sent in Notion:", updateError);
        }
      }
    } catch (emailError) {
      console.error("Welcome email failed:", emailError);
    }

    // Ingest to Open Brain master CRM (fire-and-forget)
    // "coaching" is always the business here — Business Partnerships still
    // lands in coaching pipeline since that's how Sam tracks them.
    void ingestToOpenBrain({
      email,
      name,
      business: "coaching",
      source: "sammorrispb_coaching",
      interest,
      metadata: {
        is_lnd_member: isLndMember,
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
