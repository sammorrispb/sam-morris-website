import { NextResponse } from "next/server";
import { generateEmailDraft } from "@/lib/emailTemplates";
import { sendEmail, notifySam } from "@/lib/email";

export const maxDuration = 30;

type EvalBookRequest = {
  name?: string;
  email?: string;
  utm_campaign?: string;
  utm_content?: string;
  visitor_id?: string;
};

export async function POST(request: Request) {
  try {
    const { name, email, utm_campaign, utm_content } =
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
        `Name: ${name}\nEmail: ${normalizedEmail}\nSource: meta_ad\nCampaign: ${utm_campaign ?? "n/a"}\nVariant: ${utm_content ?? "n/a"}\nSubmitted: ${new Date().toLocaleString("en-US", { timeZone: "America/New_York" })}`
      );
    } catch (err) {
      console.error("[eval-book] Sam notification failed", err);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[eval-book] unhandled", err);
    return NextResponse.json(
      { error: "Failed to submit booking" },
      { status: 500 }
    );
  }
}
