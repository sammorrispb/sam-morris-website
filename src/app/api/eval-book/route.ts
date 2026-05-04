import { NextResponse } from "next/server";
import { generateEmailDraft } from "@/lib/emailTemplates";
import { sendEmail, notifySam } from "@/lib/email";
import { ingestToOpenBrain } from "@/lib/open-brain-ingest";

export const maxDuration = 30;

type EvalBookRequest = {
  name?: string;
  email?: string;
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
    const { name, email, utm_campaign, utm_content, utm, page } =
      (await request.json()) as EvalBookRequest;

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

    // Welcome email to player (fire-and-forget; never block the response)
    try {
      const body = generateEmailDraft("Free Evaluation", name);
      await sendEmail(
        normalizedEmail,
        "Your free pickleball evaluation — next steps",
        body
      );
    } catch (err) {
      console.error("[eval-book] welcome email failed", err);
    }

    // Notify Sam
    try {
      await notifySam(
        `New Eval Booking: ${name}`,
        `Name: ${name}\nEmail: ${normalizedEmail}\nSource: meta_ad\nCampaign: ${utm_campaign ?? utm?.utm_campaign ?? "n/a"}\nVariant: ${utm_content ?? "n/a"}\nSubmitted: ${new Date().toLocaleString("en-US", { timeZone: "America/New_York" })}`
      );
    } catch (err) {
      console.error("[eval-book] Sam notification failed", err);
    }

    // Ingest to Open Brain master CRM (fire-and-forget)
    void ingestToOpenBrain({
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
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[eval-book] unhandled", err);
    return NextResponse.json(
      { error: "Failed to submit booking" },
      { status: 500 }
    );
  }
}
