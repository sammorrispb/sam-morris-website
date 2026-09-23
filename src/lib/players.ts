/**
 * Player CRM shared types and pure helpers.
 *
 * Players live in the Coaching Clients Notion database (created by the
 * Stripe webhook on purchase, and upserted on lesson confirmation).
 * Lesson history lives in the existing Lesson Log database (one row per
 * confirmed lesson, Client relation -> Coaching Clients); payments are
 * read live from Stripe by customer email so there is nothing to keep
 * in sync.
 *
 * Client-safe: no Node-only imports.
 */

/** Sam's chosen level scale for coached players. */
export const PLAYER_LEVELS = ["Beginner", "Intermediate", "Advanced"] as const;
export type PlayerLevel = (typeof PLAYER_LEVELS)[number];

export function isPlayerLevel(value: unknown): value is PlayerLevel {
  return (
    typeof value === "string" &&
    (PLAYER_LEVELS as readonly string[]).includes(value)
  );
}

export interface Player {
  id: string;
  name: string;
  email: string;
  phone: string;
  level: PlayerLevel | "";
  status: string;
  source: string;
  notes: string;
  hoursPurchased: number;
  hoursUsed: number;
  created: string;
}

export interface LessonRow {
  id: string;
  playerId: string;
  title: string;
  date: string;
  location: string;
  durationMin: number;
  amountCents: number;
  status: string;
  invoiceUrl: string;
  calendarEventId: string;
}

export interface PlayerInvoice {
  id: string;
  number: string;
  created: number;
  amountCents: number;
  status: string;
  hostedUrl: string;
  description: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function titleOf(props: any, key: string): string {
  const p = props?.[key];
  if (p?.type === "title") return (p.title ?? []).map((t: { plain_text?: string }) => t.plain_text ?? "").join("");
  return "";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function richTextOf(props: any, key: string): string {
  const p = props?.[key];
  if (p?.type === "rich_text") return (p.rich_text ?? []).map((t: { plain_text?: string }) => t.plain_text ?? "").join("");
  return "";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function selectOf(props: any, key: string): string {
  return props?.[key]?.select?.name ?? "";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function numberOf(props: any, key: string): number {
  const n = props?.[key]?.number;
  return typeof n === "number" ? n : 0;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function dateOf(props: any, key: string): string {
  return props?.[key]?.date?.start ?? "";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function emailOf(props: any, key: string): string {
  const p = props?.[key];
  return p?.type === "email" ? (p.email ?? "") : "";
}

// The Coaching Clients "Created" property is a created_time, not a date.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createdOf(props: any): string {
  const p = props?.["Created"];
  if (typeof p?.created_time === "string") return p.created_time.slice(0, 10);
  return p?.date?.start ?? "";
}

/** Lesson Log "Duration" select options (30min / 1hr / 1.5hr / 2hr). */
const DURATION_LABEL_MINUTES: Record<string, number> = {
  "30min": 30,
  "1hr": 60,
  "1.5hr": 90,
  "2hr": 120,
};

export function durationLabelToMinutes(label: string): number {
  return DURATION_LABEL_MINUTES[label] ?? 0;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapClientPage(page: any): Player {
  const props = page.properties ?? {};
  const level = selectOf(props, "Skill Level");
  return {
    id: page.id as string,
    name: titleOf(props, "Name"),
    email: emailOf(props, "Email"),
    phone: props?.["Phone"]?.phone_number ?? "",
    level: isPlayerLevel(level) ? level : "",
    status: selectOf(props, "Status"),
    source: selectOf(props, "Source"),
    notes: richTextOf(props, "Notes"),
    hoursPurchased: numberOf(props, "Hours Purchased"),
    hoursUsed: numberOf(props, "Hours Used"),
    created: createdOf(props),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapLessonPage(page: any): LessonRow {
  const props = page.properties ?? {};
  const rel = props?.["Client"]?.relation ?? [];
  return {
    id: page.id as string,
    playerId: rel[0]?.id ?? "",
    title: titleOf(props, "Session"),
    date: dateOf(props, "Date"),
    location: selectOf(props, "Location"),
    durationMin: durationLabelToMinutes(selectOf(props, "Duration")),
    amountCents: numberOf(props, "Amount (cents)"),
    // The Lesson Log has no per-row status, invoice URL, or calendar id —
    // payment state comes from the live Stripe invoice list instead.
    status: "",
    invoiceUrl: "",
    calendarEventId: "",
  };
}

/** Email validation for the add-player form — good enough for admin use. */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
