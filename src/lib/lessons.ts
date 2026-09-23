/**
 * Lesson booking flow: Sam proposes a time/location for a lesson lead, the
 * player confirms via a magic link, and a fulfillment job then sends the
 * Stripe invoice and the Google Calendar invite.
 *
 * Pricing stays single-sourced: amounts derive from PRICING in coaching.ts
 * (the only file allowed to contain literal dollar amounts).
 *
 * Client-safe: no Node-only imports (uses Web Crypto for tokens).
 */
import { PRICING } from "./coaching";

export const SITE_URL = "https://www.sammorrispb.com";
export const ET_TIMEZONE = "America/New_York";

/** Interests that can go through the lesson confirmation flow. */
export const LESSON_INTERESTS = [
  "Private Lesson",
  "Group Lesson (2+)",
  "3+1 Play-In Special",
] as const;

/** How long a player's confirm link stays valid. */
export const CONFIRM_WINDOW_DAYS = 7;

/**
 * 15-minute lesson start slots, 6:00 AM – 10:00 PM ET.
 * Shared by the admin propose modal and the player counter form.
 */
export const TIME_SLOT_OPTIONS: { value: string; label: string }[] = (() => {
  const slots: { value: string; label: string }[] = [];
  for (let mins = 6 * 60; mins <= 22 * 60; mins += 15) {
    const h24 = Math.floor(mins / 60);
    const m = mins % 60;
    const value = `${String(h24).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
    const label = `${h12}:${String(m).padStart(2, "0")} ${h24 < 12 ? "AM" : "PM"}`;
    slots.push({ value, label });
  }
  return slots;
})();

/** Statuses used by the lesson flow (subset of the Notion Status select). */
export const LESSON_STATUS = {
  AWAITING_PLAYER: "Awaiting player",
  CONFIRMED: "Confirmed",
  COUNTERED: "Countered",
} as const;

export function generateConfirmToken(): string {
  // Web Crypto UUID (32 hex chars) — works on server, edge, and client.
  return crypto.randomUUID().replace(/-/g, "");
}

export function buildConfirmUrl(token: string): string {
  return `${SITE_URL}/lessons/confirm?token=${token}`;
}

export function confirmByDate(from: Date = new Date()): Date {
  return new Date(from.getTime() + CONFIRM_WINDOW_DAYS * 24 * 60 * 60 * 1000);
}

/**
 * "Private lesson with Coach Sam and Alex Rivera"
 * "Group lesson with Coach Sam and Alex Rivera, Jordan Lee"
 */
export function lessonTitle(interest: string, playerNames: string[]): string {
  const names = playerNames.map((n) => n.trim()).filter(Boolean);
  const who = names.length > 0 ? ` and ${names.join(", ")}` : "";
  if (interest === "3+1 Play-In Special") return `3+1 Play-In with Coach Sam${who}`;
  if (interest === "Group Lesson (2+)") return `Group lesson with Coach Sam${who}`;
  return `Private lesson with Coach Sam${who}`;
}

/** Invoice amount in cents: the hourly rate prorated by duration. */
export function lessonAmountCents(durationMin: number): number {
  return Math.round(PRICING.lessonPerHourUsd * 100 * (durationMin / 60));
}

export function formatAmountDollars(cents: number): string {
  return `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;
}

/** "Tue, Sep 29 at 6:00 PM ET" for an ISO datetime. */
export function formatLessonDateTime(isoStart: string): string {
  const d = new Date(isoStart);
  const date = d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: ET_TIMEZONE,
  });
  const time = d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: ET_TIMEZONE,
  });
  return `${date} at ${time} ET`;
}

/**
 * Build an ISO-8601 datetime with the correct America/New_York UTC offset
 * for the given local date (YYYY-MM-DD) and time (HH:MM, 24h).
 */
export function etDateTimeIso(dateStr: string, timeStr: string): string {
  return `${dateStr}T${timeStr}:00${etOffsetFor(dateStr, timeStr)}`;
}

function etOffsetFor(dateStr: string, timeStr: string): string {
  const probe = new Date(`${dateStr}T${timeStr}:00Z`);
  const tzName =
    new Intl.DateTimeFormat("en-US", {
      timeZone: ET_TIMEZONE,
      timeZoneName: "shortOffset",
    })
      .formatToParts(probe)
      .find((p) => p.type === "timeZoneName")?.value ?? "";
  const m = tzName.match(/GMT([+-])(\d{1,2})/);
  if (!m) return "-05:00";
  return `${m[1]}${m[2].padStart(2, "0")}:00`;
}

/** End time ISO for a lesson starting at `isoStart` running `durationMin`. */
export function lessonEndIso(isoStart: string, durationMin: number): string {
  return new Date(new Date(isoStart).getTime() + durationMin * 60_000).toISOString();
}
