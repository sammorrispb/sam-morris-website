import { NextResponse } from "next/server";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

/**
 * Payment fulfillment lives in Coach OS. This legacy destination remains a
 * signed, review-only acknowledgment until it is removed from Stripe.
 *
 * The previous email/time-window Notion check was neither payment-keyed nor
 * atomic. Do not restore buyer emails, client creation or purchased hours here
 * without a durable fulfillment claim and an explicitly owned producer.
 */
export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  const signature = request.headers.get("stripe-signature");
  if (!secret || !key) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const stripe = new Stripe(key, { apiVersion: "2026-02-25.clover" });
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(await request.text(), signature, secret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }
  const session = event.data.object as Stripe.Checkout.Session;
  if (session.metadata?.payment_owner !== "sam_website") {
    return NextResponse.json({ received: true, skipped: "payment_not_owned" });
  }
  if (session.payment_status !== "paid") {
    return NextResponse.json({ received: true, skipped: "not_paid" });
  }

  // A marker identifies a producer; it is not a durable fulfillment receipt.
  // Unknown historical links must not become clients merely because an amount
  // matches an old coaching price. Review in Stripe/Coach OS without re-emailing.
  console.warn("[stripe-webhook] legacy own-tagged checkout requires manual review", event.id, session.id);
  return NextResponse.json({ received: true, skipped: "manual_review_required" });
}
