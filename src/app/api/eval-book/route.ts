import { NextResponse } from "next/server";
import { generateEmailDraft } from "@/lib/emailTemplates";
import { sendEmail, notifySam } from "@/lib/email";

export const maxDuration = 30;

type EvalBookRequest = {
  name?: string;
  email?: string;
  utm_campaign?: string;
  utm_content?: string;
};

async function forwardToHub(payload: {
  name: string;
  email: string;
  source: string;
  utm_campaign?: string;
  utm_content?: string;
}): Promise<{ ok: boolean; eval_session_id?: string; error?: string }> {
  const url = process.env.HUB_EVAL_BOOK_URL?.trim();
  const token = process.env.HUB_INGEST_TOKEN?.trim();
  if (!url || !token) {
    console.warn("[eval-book] Hub forward skipped — missing env");
    return { ok: false, error: "missing_env" };
  }

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-lead-ingest-token": token,
    },
    body: JSON.stringify({ action: "book", ...payload }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error("[eval-book] Hub forward failed", res.status, body.slice(0, 300));
    return { ok: false, error: `hub_${res.status}` };
  }

  const data = (await res.json().catch(() => ({}))) as {
    eval_session_id?: string;
  };
  return { ok: true, eval_session_id: data.eval_session_id };
}

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

    // 1. Forward to Hub eval_sessions (core write — awaited so we know if it landed)
    const hubResult = await forwardToHub({
      name,
      email: normalizedEmail,
      source: "meta_ad",
      utm_campaign,
      utm_content,
    });

    // 2. Welcome email to player (fire-and-forget; never block the response)
    try {
      const body = generateEmailDraft("Free Evaluation", name, false);
      await sendEmail(
        normalizedEmail,
        "Your free pickleball evaluation — next steps",
        body
      );
    } catch (err) {
      console.error("[eval-book] welcome email failed", err);
    }

    // 3. Notify Sam
    try {
      await notifySam(
        `New Eval Booking: ${name}`,
        `Name: ${name}\nEmail: ${normalizedEmail}\nSource: meta_ad\nCampaign: ${utm_campaign ?? "n/a"}\nVariant: ${utm_content ?? "n/a"}\nHub session: ${hubResult.eval_session_id ?? "FORWARD FAILED (" + (hubResult.error ?? "unknown") + ")"}\nSubmitted: ${new Date().toLocaleString("en-US", { timeZone: "America/New_York" })}`
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
