import { Client } from "@notionhq/client";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { notifySam } from "@/lib/email";

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

  // Create Notion lead
  try {
    const apiKey = process.env.NOTION_API_KEY?.trim();
    const dbId = process.env.NOTION_LEADS_DB_ID?.trim();

    if (apiKey && dbId) {
      const notion = new Client({ auth: apiKey });
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

  // Notify Sam
  try {
    await notifySam(
      `Payment Received: ${name} — ${product}`,
      `Name: ${name}\nEmail: ${email}\nProduct: ${product}\nAmount: $${(amount / 100).toFixed(2)}\nTime: ${new Date().toLocaleString("en-US", { timeZone: "America/New_York" })}`
    );
  } catch (notifyError) {
    console.error("Stripe webhook: notification failed:", notifyError);
  }

  // Always return 200 to prevent Stripe retries
  return NextResponse.json({ received: true });
}
