import { Client } from "@notionhq/client";
import { NextResponse } from "next/server";
import { generateEmailDraft } from "@/lib/emailTemplates";
import { sendEmail, notifySam } from "@/lib/email";
import { ingestToOpenBrain } from "@/lib/open-brain-ingest";

async function createEmailDraft(
  notion: Client,
  name: string,
  email: string,
  interest: string,
): Promise<void> {
  const draftsDbId = process.env.NOTION_DRAFTS_DB_ID?.trim();
  if (!draftsDbId) return;

  const emailBody = generateEmailDraft(interest, name, false);

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
      Created: { date: { start: new Date().toISOString() } },
      Status: { select: { name: "Draft" } },
    },
    children: paragraphs,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, interest } = body;

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

    // Generate email draft — isolated so lead creation never fails
    try {
      await createEmailDraft(notion, name, email, interest);
    } catch (draftError) {
      console.error("Email draft creation failed (lead still saved):", draftError);
    }

    // Notify Sam about the new lead
    try {
      await notifySam(
        `New Lead: ${name} — ${interest}`,
        `Name: ${name}\nEmail: ${email}\nInterest: ${interest}\nSubmitted: ${new Date().toLocaleString("en-US", { timeZone: "America/New_York" })}`
      );
    } catch (notifyError) {
      console.error("Lead notification email failed:", notifyError);
    }

    // Send welcome email to the lead
    try {
      const emailBody = generateEmailDraft(interest, name, false);
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
    void ingestToOpenBrain({
      email,
      name,
      business: "coaching",
      source: "sammorrispb_coaching",
      interest,
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
