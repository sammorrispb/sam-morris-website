/**
 * Player CRM shared types and pure helpers.
 *
 * Players live in the Coaching Clients Notion database (created by the
 * Stripe webhook on purchase, and upserted on lesson confirmation).
 * Lesson history lives in a separate Lessons database (one row per
 * confirmed lesson, relation -> client); payments are read live from Stripe
 * by customer email so there is nothing to keep in sync.
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
    created: dateOf(props, "Created"),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapLessonPage(page: any): LessonRow {
  const props = page.properties ?? {};
  const rel = props?.["Player"]?.relation ?? [];
  return {
    id: page.id as string,
    playerId: rel[0]?.id ?? "",
    title: titleOf(props, "Name"),
    date: dateOf(props, "Date"),
    location: richTextOf(props, "Location"),
    durationMin: numberOf(props, "Duration (min)"),
    amountCents: numberOf(props, "Amount (cents)"),
    status: selectOf(props, "Status"),
    invoiceUrl: props?.["Stripe Invoice URL"]?.url ?? "",
    calendarEventId: richTextOf(props, "Calendar Event ID"),
  };
}

/** Email validation for the add-player form — good enough for admin use. */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
