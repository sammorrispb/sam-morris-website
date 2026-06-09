"use server";

import { headers } from "next/headers";
import { Client } from "@notionhq/client";
import { ingestToOpenBrain } from "@/lib/open-brain-ingest";
import { sendEmail, notifySam } from "@/lib/email";
import { insertCohortWaiver } from "@/lib/supabase-community";
import {
  COHORT_CONTEXT,
  CURRENT_SEASON,
  SUPPORT_EMAIL,
} from "@/lib/waiver/cohort-content";
import {
  computeIsMinor,
  normalizePhone,
  type CohortSignupResult,
} from "./state";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SMS_SNAPSHOT = `By checking this box, I agree to receive SMS text messages from Coach Sam Pickleball at the phone number provided regarding this cohort: schedule reminders, location updates, weather cancellations, and tournament pairing details. Message frequency varies (typically up to 6 messages per cohort). Message and data rates may apply. Consent is not required to participate. Reply HELP for help or STOP to unsubscribe at any time.`;

function getNotion(): Client | null {
  const key = process.env.NOTION_API_KEY?.trim();
  if (!key) return null;
  return new Client({ auth: key });
}

async function createCohortLead(
  notion: Client,
  data: {
    name: string;
    email: string;
    phone: string;
    isMinor: boolean;
    parentName?: string;
    parentEmail?: string;
    otherCoach: boolean;
    notes?: string;
    waiverId: string;
  }
): Promise<void> {
  const dbId = process.env.NOTION_LEADS_DB_ID?.trim();
  if (!dbId) return;

  await notion.pages.create({
    parent: { data_source_id: dbId },
    properties: {
      Name: { title: [{ text: { content: data.name } }] },
      Email: { email: data.email },
      Phone: { phone_number: data.phone },
      Interest: { select: { name: "Cohort Series" } },
      Source: { select: { name: "Website" } },
      Status: { select: { name: "New Lead" } },
      "Date Submitted": { date: { start: new Date().toISOString() } },
      Notes: {
        rich_text: [
          {
            text: {
              content: [
                `Cohort signup. is_minor=${data.isMinor}.`,
                data.parentName ? `Parent: ${data.parentName} <${data.parentEmail}>.` : null,
                data.otherCoach ? "FLAG: currently trains with another coach." : null,
                data.notes ? `Notes: ${data.notes}` : null,
                `Waiver ID: ${data.waiverId}`,
              ]
                .filter(Boolean)
                .join(" "),
            },
          },
        ],
      },
    },
  });
}

export async function submitCohortSignup(
  formData: FormData
): Promise<CohortSignupResult> {
  const full_name = String(formData.get("full_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const phoneRaw = String(formData.get("phone") ?? "").trim();
  const dob = String(formData.get("dob") ?? "").trim();
  const parent_name = String(formData.get("parent_name") ?? "").trim();
  const parent_email = String(formData.get("parent_email") ?? "").trim().toLowerCase();
  const parent_phone_raw = String(formData.get("parent_phone") ?? "").trim();
  const liability_consent = formData.get("liability_consent") === "on";
  const media_consent = formData.get("media_consent") === "on";
  const sms_consent = formData.get("sms_consent") === "on";
  const other_coach = formData.get("other_coach") === "on";
  const notes = String(formData.get("notes") ?? "").trim().slice(0, 500);

  if (!full_name) return { ok: false, error: "Full name is required.", field: "full_name" };
  if (!email || !EMAIL_RE.test(email))
    return { ok: false, error: "Valid email is required.", field: "email" };
  const phone = normalizePhone(phoneRaw);
  if (!phone) return { ok: false, error: "Valid US phone number is required.", field: "phone" };
  if (!dob) return { ok: false, error: "Date of birth is required.", field: "dob" };

  const is_minor = computeIsMinor(dob);

  let parent_phone: string | null = null;
  if (is_minor) {
    if (!parent_name || !parent_email || !parent_phone_raw) {
      return {
        ok: false,
        error: "Parent/guardian name, email, and phone are required for minors.",
        field: "parent_name",
      };
    }
    if (!EMAIL_RE.test(parent_email)) {
      return { ok: false, error: "Valid parent email is required.", field: "parent_email" };
    }
    parent_phone = normalizePhone(parent_phone_raw);
    if (!parent_phone) {
      return { ok: false, error: "Valid parent US phone is required.", field: "parent_phone" };
    }
  }

  if (!liability_consent) {
    return { ok: false, error: "Liability consent is required to participate.", field: "liability_consent" };
  }
  if (!media_consent) {
    return { ok: false, error: "Media-release consent is required to participate.", field: "media_consent" };
  }

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0].trim() ?? null;
  const user_agent = h.get("user-agent") ?? null;

  const waiverResult = await insertCohortWaiver({
    full_name,
    email,
    phone,
    dob,
    is_minor,
    parent_name: is_minor ? parent_name : null,
    parent_email: is_minor ? parent_email : null,
    parent_phone,
    liability_consent: true,
    media_consent: true,
    sms_consent,
    sms_consent_text: sms_consent ? SMS_SNAPSHOT : null,
    ip_address: ip,
    user_agent,
    event_context: COHORT_CONTEXT,
    season: CURRENT_SEASON,
  });

  if (!waiverResult.ok) {
    console.error("[cohort-signup] waiver insert failed", waiverResult.error);
    return {
      ok: false,
      error: "We couldn't save your waiver. Please try again, or email " + SUPPORT_EMAIL + ".",
    };
  }

  const notion = getNotion();
  if (notion) {
    try {
      await createCohortLead(notion, {
        name: full_name,
        email,
        phone,
        isMinor: is_minor,
        parentName: is_minor ? parent_name : undefined,
        parentEmail: is_minor ? parent_email : undefined,
        otherCoach: other_coach,
        notes,
        waiverId: waiverResult.id,
      });
    } catch (err) {
      console.error("[cohort-signup] Notion lead create failed", err);
    }
  }

  try {
    await notifySam(
      `New Cohort Signup: ${full_name}`,
      [
        `Name: ${full_name}`,
        `Email: ${email}`,
        `Phone: ${phone}`,
        `DOB: ${dob} (${is_minor ? "minor" : "adult"})`,
        is_minor ? `Parent: ${parent_name} <${parent_email}> ${parent_phone}` : null,
        `Other coach: ${other_coach ? "YES — flag" : "no"}`,
        notes ? `Notes: ${notes}` : null,
        `Waiver ID: ${waiverResult.id}`,
        `Submitted: ${new Date().toLocaleString("en-US", { timeZone: "America/New_York" })}`,
      ]
        .filter(Boolean)
        .join("\n")
    );
  } catch (err) {
    console.error("[cohort-signup] Sam notification failed", err);
  }

  const confirmEmail = is_minor ? parent_email : email;
  const confirmName = is_minor ? parent_name : full_name;
  try {
    await sendEmail(
      confirmEmail,
      "Cohort signup received — Coach Sam will confirm your spot",
      [
        `Hi ${confirmName.split(" ")[0] ?? "there"},`,
        ``,
        `Thanks for signing up for the Coach Sam 4-Week Training Cohort. Your waiver is on file.`,
        ``,
        `Coach Sam confirms your spot and sends an invoice once the cohort is set. You'll hear from him within 24 hours with the cohort start date, court location, roster, and the tournament we're pointing at — plus the all-in price (training + your tournament entry, one commitment).`,
        ``,
        `Questions: ${SUPPORT_EMAIL}`,
        ``,
        `— Sam Morris`,
      ].join("\n")
    );
  } catch (err) {
    console.error("[cohort-signup] confirmation email failed", err);
  }

  try {
    await ingestToOpenBrain({
      email,
      name: full_name,
      phone,
      business: "coaching",
      source: "sammorrispb_cohort_signup",
      interest: "Cohort Series",
      metadata: {
        is_minor,
        parent_email: is_minor ? parent_email : undefined,
        other_coach,
        waiver_id: waiverResult.id,
        event_context: COHORT_CONTEXT,
      },
    });
  } catch (err) {
    console.error("[cohort-signup] OB ingest failed", err);
  }

  return { ok: true, redirectUrl: "/programs/cohort/signup/confirmed" };
}
