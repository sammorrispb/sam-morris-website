import { NextResponse } from "next/server";
import { generateEmailDraft } from "@/lib/emailTemplates";
import { sendEmail, notifySam } from "@/lib/email";
import { ingestToOpenBrain } from "@/lib/open-brain-ingest";

export const maxDuration = 30;

type EvalBookRequest = {
  name?: string;
  email?: string;
  location?: string;
  utm_campaign?: string;
  utm_content?: string;
  visitor_id?: string;
  page?: string;
  utm?: {
    utm_source?: string;
    utm_campaign?: string;
    utm_medium?: string;
    ref?: string;
  };
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as EvalBookRequest;
    const { name, email, utm_campaign, utm_content, utm, page } = body;
    const location: string =
      typeof body.location === "string"
        ? body.location.replace(/\s+/g, " ").trim().slice(0, 100)
        : "";

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
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

    const normalizedEmail = email.toLowerCase();

    // Welcome email to player. We capture the result instead of fire-and-forget
    // so a silent mailer outage (missing/invalid GMAIL_APP_PASSWORD) becomes a
    // durable signal in Open Brain below rather than vanishing. Incident: an
    // eval lead submitted, saw a success screen, but no confirmation was ever
    // delivered and Sam was never notified.
    let confirmationSent = false;
    let confirmationError: string | undefined;
    try {
      const body = generateEmailDraft("Free Evaluation", name);
      const result = await sendEmail(
        normalizedEmail,
        "Your free pickleball evaluation — next steps",
        body
      );
      confirmationSent = result.success;
      if (!result.success) confirmationError = result.error;
    } catch (err) {
      confirmationError = err instanceof Error ? err.message : "unknown";
      console.error("[eval-book] welcome email failed", err);
    }
    if (!confirmationSent) {
      console.error(
        `[eval-book] confirmation email NOT delivered to ${normalizedEmail}: ${confirmationError ?? "unknown"}`
      );
    }

    // Notify Sam (same transporter — if it's down, Sam never hears about the
    // lead via email, so we record whether the alert actually went out).
    let samNotified = false;
    try {
      const result = await notifySam(
        `New Eval Booking: ${name}`,
        `Name: ${name}\nEmail: ${normalizedEmail}${location ? `\nPreferred Location: ${location}` : ""}\nSource: meta_ad\nCampaign: ${utm_campaign ?? utm?.utm_campaign ?? "n/a"}\nVariant: ${utm_content ?? "n/a"}\nSubmitted: ${new Date().toLocaleString("en-US", { timeZone: "America/New_York" })}`
      );
      samNotified = result.success;
    } catch (err) {
      console.error("[eval-book] Sam notification failed", err);
    }
    if (!samNotified) {
      console.error(
        `[eval-book] Sam NOT notified of eval booking for ${name} <${normalizedEmail}>`
      );
    }

    // Ingest to Open Brain master CRM. AWAIT — Vercel drops fire-and-forget
    // Promises when the lambda returns. Helper has its own 5s timeout.
    await ingestToOpenBrain({
      email: normalizedEmail,
      name,
      business: "coaching",
      source: "sammorrispb_eval_book",
      interest: "Free Evaluation",
      utm: {
        source: utm?.utm_source,
        campaign: utm?.utm_campaign ?? utm_campaign,
        medium: utm?.utm_medium,
      },
      metadata: {
        page,
        ref: utm?.ref,
        utm_content,
        ...(location ? { location } : {}),
        // Durable delivery record. Open Brain is the one channel that survives
        // a Gmail outage, so flag here when the booking generated no email —
        // these are the leads that need manual follow-up.
        confirmation_email_sent: confirmationSent,
        sam_notified: samNotified,
        ...(confirmationError ? { email_error: confirmationError } : {}),
      },
    });

    return NextResponse.json({ success: true, confirmationEmailSent: confirmationSent });
  } catch (err) {
    console.error("[eval-book] unhandled", err);
    return NextResponse.json(
      { error: "Failed to submit booking" },
      { status: 500 }
    );
  }
}
