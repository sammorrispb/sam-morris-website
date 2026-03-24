import { Client } from "@notionhq/client";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { generateEmailDraft } from "@/lib/emailTemplates";
import { sendEmail, notifySam } from "@/lib/email";
import { createCoachingClient } from "@/lib/coaching-crm";

export const dynamic = "force-dynamic";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-02-25.clover",
  });
}

function mapProduct(amountCents: number): string {
  if (amountCents === 13000) return "Single Lesson";
  if (amountCents === 40000) return "4-Hour Package";
  return `$${(amountCents / 100).toFixed(2)} purchase`;
}

async function checkLndMembership(email: string): Promise<boolean> {
  const url = process.env.LND_SUPABASE_URL;
  const key = process.env.LND_SUPABASE_SERVICE_KEY;
  if (!url || !key || !email) return false;

  const supabase = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data, error } = await supabase.auth.admin.listUsers({ perPage: 1000 });
  if (error || !data?.users) return false;

  return data.users.some(
    (u) => u.email?.toLowerCase() === email.toLowerCase()
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function hasDuplicatePaidLead(notion: Client, dbId: string, email: string): Promise<boolean> {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response: any = await notion.dataSources.query({
    data_source_id: dbId,
    filter: {
      and: [
        { property: "Email", email: { equals: email } },
        { property: "Status", select: { equals: "Paid" } },
        { property: "Date Submitted", date: { after: oneHourAgo } },
      ],
    },
  });
  return (response.results?.length ?? 0) > 0;
}

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Invalid signature";
    console.error("Stripe signature verification failed:", msg);
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const email = session.customer_details?.email ?? "";
  const name = session.customer_details?.name ?? "Unknown";
  const amount = session.amount_total ?? 0;
  const product = mapProduct(amount);

  // Create Notion lead (with idempotency check)
  try {
    const apiKey = process.env.NOTION_API_KEY?.trim();
    const dbId = process.env.NOTION_LEADS_DB_ID?.trim();

    if (apiKey && dbId && email) {
      const notion = new Client({ auth: apiKey });

      // Skip if a duplicate Paid lead already exists for this email within the last hour
      const isDuplicate = await hasDuplicatePaidLead(notion, dbId, email);
      if (isDuplicate) {
        console.log("Stripe webhook: duplicate Paid lead detected, skipping:", email);
        return NextResponse.json({ received: true });
      }

      await notion.pages.create({
        parent: { data_source_id: dbId },
        properties: {
          Name: { title: [{ text: { content: name } }] },
          Email: { email: email || null },
          Interest: { select: { name: "Coaching" } },
          Status: { select: { name: "Paid" } },
          Source: { select: { name: "Stripe" } },
          "Date Submitted": { date: { start: new Date().toISOString() } },
        },
      });
    }
  } catch (notionError) {
    console.error("Stripe webhook: Notion lead creation failed:", notionError);
  }

  // Create coaching client in CRM (with dedup)
  try {
    const apiKey = process.env.NOTION_API_KEY?.trim();
    const clientsDbId = process.env.NOTION_COACHING_CLIENTS_DB_ID?.trim();
    const skillsDbId = process.env.NOTION_COACHING_SKILLS_DB_ID?.trim();

    if (apiKey && clientsDbId && skillsDbId && email) {
      const notion = new Client({ auth: apiKey });
      const hoursPurchased = amount === 13000 ? 1 : amount === 40000 ? 4 : 0;

      const result = await createCoachingClient(notion, clientsDbId, skillsDbId, {
        name,
        email,
        hoursPurchased,
        source: "Stripe",
      });

      if (result.skipped) {
        console.log("Stripe webhook: coaching client already exists, skipped:", email);
      } else {
        console.log("Stripe webhook: coaching client created:", result.clientPageId, `(${result.skillCount} skills)`);
      }
    }
  } catch (crmError) {
    console.error("Stripe webhook: coaching client creation failed:", crmError);
  }

  // Notify Sam
  try {
    await notifySam(
      `Payment Received: ${name} — ${product}`,
      `Name: ${name}\nEmail: ${email}\nProduct: ${product}\nAmount: $${(amount / 100).toFixed(2)}\nTime: ${new Date().toLocaleString("en-US", { timeZone: "America/New_York" })}`
    );
  } catch (notifyError) {
    console.error("Stripe webhook: notification failed:", notifyError);
  }

  // Send welcome email to buyer
  if (email) {
    try {
      let isLndMember = false;
      try {
        isLndMember = await checkLndMembership(email);
      } catch {
        console.error("Stripe webhook: L&D membership check failed");
      }

      const emailBody = generateEmailDraft("Coaching", name, isLndMember);
      await sendEmail(email, `Thanks for booking, ${name}!`, emailBody);
    } catch (emailError) {
      console.error("Stripe webhook: welcome email failed:", emailError);
    }
  }

  // Always return 200 to prevent Stripe retries
  return NextResponse.json({ received: true });
}
