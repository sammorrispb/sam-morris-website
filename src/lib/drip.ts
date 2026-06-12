import { createHmac } from "crypto";
import { sendEmail, notifySam } from "@/lib/email";
import { generateDripEmail } from "@/lib/emailTemplates";

/**
 * Lead drip engine. Runs inside the daily /api/cron/follow-up cron (phase 1)
 * and sends a short, on-brand follow-up sequence to leads that received the
 * welcome email but are still sitting in Status=New.
 *
 * Schedule is measured in days since "Date Submitted":
 *   step 1 → day 2, step 2 → day 5, step 3 → day 9.
 * Leads older than DRIP_MAX_AGE_DAYS are never dripped (skip + flag) — a
 * day-15 "automated" follow-up reads as spam, not coaching.
 */
export const DRIP_SCHEDULE = [
  { step: 1, afterDays: 2 },
  { step: 2, afterDays: 5 },
  { step: 3, afterDays: 9 },
] as const;

export const DRIP_MAX_AGE_DAYS = 14;

const SITE_BASE = "https://www.sammorrispb.com";
const MS_PER_DAY = 86_400_000;

// Structural type so the engine is testable with a mocked Notion client.
type NotionLike = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataSources: { query: (args: any) => Promise<any> };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pages: { update: (args: any) => Promise<any> };
};

export type DripAction =
  | "sent"
  | "send_failed"
  | "dry_run_candidate"
  | "skipped_not_due"
  | "skipped_sent_today"
  | "skipped_aged_out"
  | "skipped_no_email";

export interface DripRowResult {
  pageId: string;
  name: string;
  email: string;
  interest: string;
  step: number;
  ageDays: number;
  action: DripAction;
}

export interface DripSummary {
  dryRun: boolean;
  processed: number;
  sent: number;
  failed: number;
  skipped: number;
  agedOut: number;
  rows: DripRowResult[];
}

/**
 * HMAC-SHA256 signature for the one-click unsubscribe link, keyed by
 * DRIP_SECRET (falling back to CRON_SECRET so no new env var is required).
 */
export function unsubscribeSig(pageId: string): string {
  const secret = process.env.DRIP_SECRET ?? process.env.CRON_SECRET;
  if (!secret) throw new Error("DRIP_SECRET/CRON_SECRET not configured");
  return createHmac("sha256", secret).update(pageId).digest("hex");
}

export function unsubscribeUrl(pageId: string): string {
  return `${SITE_BASE}/api/drip/unsubscribe?id=${encodeURIComponent(pageId)}&sig=${unsubscribeSig(pageId)}`;
}

/** UTC calendar date (YYYY-MM-DD) — ISO-string math only, never new Date(y,m,d). */
function utcDateOnly(iso: string): string {
  return iso.slice(0, 10);
}

export async function processDrip(
  notion: NotionLike,
  dbId: string,
  { dryRun = false }: { dryRun?: boolean } = {},
): Promise<DripSummary> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response: any = await notion.dataSources.query({
    data_source_id: dbId,
    filter: {
      and: [
        { property: "Status", select: { equals: "New" } },
        { property: "Email Sent", checkbox: { equals: true } },
        { property: "Drip Opted Out", checkbox: { equals: false } },
        { property: "Drip Step", number: { less_than: 3 } },
      ],
    },
    sorts: [{ property: "Date Submitted", direction: "ascending" }],
  });

  const rows: DripRowResult[] = [];
  const summary: DripSummary = {
    dryRun,
    processed: 0,
    sent: 0,
    failed: 0,
    skipped: 0,
    agedOut: 0,
    rows,
  };

  const nowMs = Date.now();
  const todayUtc = utcDateOnly(new Date(nowMs).toISOString());

  // Sequential on purpose: Gmail SMTP + Notion both prefer slow-and-steady,
  // and per-row claim-then-send must not interleave.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const page of (response.results ?? []) as any[]) {
    summary.processed += 1;
    const props = page.properties ?? {};
    const name = props.Name?.title?.[0]?.plain_text ?? "there";
    const email: string | null = props.Email?.email ?? null;
    const interest: string = props.Interest?.select?.name ?? "";
    const currentStep: number = props["Drip Step"]?.number ?? 0;
    const submitted: string | null = props["Date Submitted"]?.date?.start ?? null;
    const lastDripSent: string | null = props["Last Drip At"]?.date?.start ?? null;

    const nextStep = currentStep + 1;
    const base: Omit<DripRowResult, "action" | "ageDays"> = {
      pageId: page.id,
      name,
      email: email ?? "—",
      interest,
      step: nextStep,
    };

    // Day math via ms diff on ISO strings ONLY (UTC-safe on Vercel).
    const ageDays = submitted
      ? Math.floor((nowMs - Date.parse(submitted)) / MS_PER_DAY)
      : 0;

    if (!email || !submitted) {
      summary.skipped += 1;
      rows.push({ ...base, ageDays, action: "skipped_no_email" });
      continue;
    }

    // Too old — never start "automated" follow-up on a 2-week-old lead.
    if (ageDays > DRIP_MAX_AGE_DAYS) {
      summary.agedOut += 1;
      rows.push({ ...base, ageDays, action: "skipped_aged_out" });
      console.warn(
        `[drip] lead aged out (${ageDays}d > ${DRIP_MAX_AGE_DAYS}d), flagged + skipped: ${name} <${email}>`,
      );
      continue;
    }

    const schedule = DRIP_SCHEDULE.find((s) => s.step === nextStep);
    if (!schedule || ageDays < schedule.afterDays) {
      summary.skipped += 1;
      rows.push({ ...base, ageDays, action: "skipped_not_due" });
      continue;
    }

    // At most one drip per UTC day per lead.
    if (lastDripSent && utcDateOnly(lastDripSent) === todayUtc) {
      summary.skipped += 1;
      rows.push({ ...base, ageDays, action: "skipped_sent_today" });
      continue;
    }

    if (dryRun) {
      rows.push({ ...base, ageDays, action: "dry_run_candidate" });
      continue;
    }

    // CLAIM-THEN-SEND: advance the step in Notion BEFORE sending so a crash
    // or retry can never double-send. Worst case we lose one touch, never
    // send two.
    await notion.pages.update({
      page_id: page.id,
      properties: {
        "Drip Step": { number: nextStep },
        "Last Drip At": { date: { start: todayUtc } },
      },
    });

    try {
      const { subject, body } = generateDripEmail(
        nextStep,
        interest,
        name,
        unsubscribeUrl(page.id),
      );
      const result = await sendEmail(email, subject, body);
      if (result.success) {
        summary.sent += 1;
        rows.push({ ...base, ageDays, action: "sent" });
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      summary.failed += 1;
      rows.push({ ...base, ageDays, action: "send_failed" });
      // Step is already incremented (claimed) — do NOT roll back; a retry
      // tomorrow would risk a double-send. Tell Sam instead and continue.
      await notifySam(
        `Drip step ${nextStep} send failed: ${name}`,
        `Could not send drip step ${nextStep} to ${name} <${email}> (${interest}).\nError: ${msg}\n\nThe step was claimed in Notion, so this touch will NOT retry automatically. Follow up manually: ${SITE_BASE}/admin`,
      ).catch(() => {});
    }
  }

  return summary;
}
