/**
 * Dated sessions Coach Sam leads at The Pickl Park, Frederick MD.
 *
 * WHY THIS FILE IS HAND-MAINTAINED
 * --------------------------------
 * The venue runs on Podplay, which mints a NEW uuid for every occurrence —
 * there is no stable per-class or per-series URL, and no public API (the
 * /apis/v2 endpoints return 401 unauthenticated). Its public listing exposes
 * a rolling window, and the `date` query param walks further out. So the only
 * way to deep-link a specific session is to record its uuid here.
 *
 * THE TRAP: class titles are shared across the venue's coaches. "101 Intro To
 * Pickleball" on a given day may be Steve Roy's, Craig Zdaniewicz's, or
 * unassigned. NEVER map a session by title or time alone — open the event page
 * and confirm the COACH field reads "Sam Morris" before adding it here. Every
 * uuid below was verified that way on the `verified` date.
 *
 * Sam's recurring block is Mon 10am/11am/12pm/1pm, Tue 10am/11am, Wed 12pm/1pm
 * — useful for finding candidates fast, but still verify each one.
 *
 * On a BLANK coach field: it usually means the venue has not filled it in, not
 * that the session is someone else's. Default to omitting it, but Sam can
 * confirm ownership directly — that is what happened with the Monday 12pm/1pm
 * assessments on 2026-08-25. His word overrides a blank field. It does NOT
 * override a field naming a different coach.
 *
 * REFRESHING (roughly monthly, or whenever the tail runs short):
 *   1. Open FREDERICK_VENUE.clinicsUrl; walk forward with `&date=YYYY-MM-DD`.
 *   2. Collect occurrences in Sam's slots.
 *   3. Open each one; keep only those whose COACH reads "Sam Morris" AND
 *      whose CTA still reads "Sign up" — a session can close registration
 *      ("Admission is no longer available") while its date is still in the
 *      future, and it is NOT a predictable cutoff: on 2026-08-25 an 11am
 *      session was already closed while a 10am one was still open. Date
 *      alone cannot tell you; you have to look.
 *   4. Replace the arrays below and bump `verified`.
 *
 * Past sessions are filtered out at render time, so a stale tail degrades to
 * "no dates listed" and the card falls back to the full clinics listing —
 * untidy, never broken.
 */

/** Last date every uuid below was confirmed live and Sam-coached. */
export const SESSIONS_VERIFIED = "2026-08-25";

export type PicklParkSession = {
  /** Local start time, ISO-8601 with explicit EDT/EST offset. */
  startsAt: string;
  /** Podplay occurrence uuid. */
  eventId: string;
};

/** Keyed by the `id` on each entry in CLASSES (programs/pickl-park/page.tsx). */
export const PICKL_PARK_SESSIONS: Record<string, PicklParkSession[]> = {
  "101": [
    { startsAt: "2026-08-31T10:00:00-04:00", eventId: "019ffd53-08bf-788f-85e8-6a6494c83f2b" },
    { startsAt: "2026-09-07T10:00:00-04:00", eventId: "019ffd53-090c-788f-85e8-b9502028c25f" },
    { startsAt: "2026-09-14T10:00:00-04:00", eventId: "019ffd53-097b-788f-85e9-0cc7d7ec266e" },
    { startsAt: "2026-09-21T10:00:00-04:00", eventId: "019ffd53-09b5-788f-85e9-5f9d918c5be6" },
    { startsAt: "2026-09-28T10:00:00-04:00", eventId: "019ffd53-09e3-788f-85e9-a84212444829" },
  ],
  "201": [
    { startsAt: "2026-08-31T11:00:00-04:00", eventId: "019ffd61-f07d-788f-860b-61c27b5f2477" },
    { startsAt: "2026-09-07T11:00:00-04:00", eventId: "019ffd61-f0ab-788f-860b-b5d317e2a24d" },
    { startsAt: "2026-09-14T11:00:00-04:00", eventId: "019ffd61-f0dc-788f-860c-015ae3de18b7" },
    { startsAt: "2026-09-21T11:00:00-04:00", eventId: "019ffd61-f10d-788f-860c-549d53382590" },
    { startsAt: "2026-09-28T11:00:00-04:00", eventId: "019ffd61-f13c-788f-860c-a26cb034de4a" },
  ],
  // Runs twice a week: Mondays 12pm and Tuesdays 10am. The Monday sessions show
  // no COACH in Podplay — the venue has not filled it in — but Sam confirmed
  // 2026-08-25 that they are his. Sam's word overrides a blank coach field; it
  // does NOT override a field naming someone else.
  // Sep 29 (019ffd76-bfae-788f-862a-d27a3a8416c0) is still unconfirmed.
  "skills-beginner": [
    { startsAt: "2026-08-31T12:00:00-04:00", eventId: "019ffd6b-6e0f-733c-9e52-1fd52ae27b26" },
    { startsAt: "2026-09-01T10:00:00-04:00", eventId: "019ffd76-bd9f-788f-8628-d025b2712328" },
    { startsAt: "2026-09-07T12:00:00-04:00", eventId: "019ffd6b-7666-733c-9e52-9a1820b41231" },
    { startsAt: "2026-09-08T10:00:00-04:00", eventId: "019ffd76-be17-788f-8629-52664c4c5ab2" },
    { startsAt: "2026-09-14T12:00:00-04:00", eventId: "019ffd6b-76dc-733c-9e53-1cc6d5da51bd" },
    { startsAt: "2026-09-15T10:00:00-04:00", eventId: "019ffd76-beb5-788f-8629-d5b59f64b4e9" },
    { startsAt: "2026-09-21T12:00:00-04:00", eventId: "019ffd6b-7996-733c-9e53-99be327151e9" },
    { startsAt: "2026-09-22T10:00:00-04:00", eventId: "019ffd76-bf37-788f-862a-50e3f8d646b6" },
    { startsAt: "2026-09-28T12:00:00-04:00", eventId: "019ffd6b-7a6d-733c-9e54-1802319ef19a" },
  ],
  // Same pattern: Mondays 1pm (coach field blank, Sam-confirmed) and Tuesdays
  // 11am. Sep 29 (019ffd77-910d-788f-862e-e6cf2ddb8f1b) still unconfirmed.
  "skills-advanced": [
    { startsAt: "2026-08-31T13:00:00-04:00", eventId: "019ffd6c-73bf-733c-9e56-47aeb1a5dc6e" },
    { startsAt: "2026-09-01T11:00:00-04:00", eventId: "019ffd77-8d75-788f-862c-e407c6d5a9b5" },
    { startsAt: "2026-09-07T13:00:00-04:00", eventId: "019ffd6c-73fa-733c-9e56-c5ace89248cc" },
    { startsAt: "2026-09-08T11:00:00-04:00", eventId: "019ffd77-8db4-788f-862d-6301831ee3f1" },
    { startsAt: "2026-09-14T13:00:00-04:00", eventId: "019ffd6c-7434-733c-9e57-4223a1b441a7" },
    { startsAt: "2026-09-15T11:00:00-04:00", eventId: "019ffd77-906a-788f-862d-e267739f4152" },
    { startsAt: "2026-09-21T13:00:00-04:00", eventId: "019ffd6c-7475-733c-9e57-c27c3ae344d0" },
    { startsAt: "2026-09-22T11:00:00-04:00", eventId: "019ffd77-90b6-788f-862e-63c43c851150" },
    { startsAt: "2026-09-28T13:00:00-04:00", eventId: "019ffd6c-74af-733c-9e58-4246fb12b8d6" },
  ],
  "101a": [
    { startsAt: "2026-08-26T12:00:00-04:00", eventId: "01a02fe6-617c-7992-a5a3-ca2c68fc91ac" },
  ],
  "104": [
    { startsAt: "2026-08-26T13:00:00-04:00", eventId: "01a02fe8-026d-7992-a5a4-4b5e7ce0b810" },
  ],
  // One-off, not part of the recurring block. The venue's other 204 variant
  // ("Mid-Court Play & Counter", Mondays 5pm) is Steve Roy's — not this one.
  "204": [
    { startsAt: "2026-08-25T10:00:00-04:00", eventId: "01a02c2b-9cdf-7992-a539-78ad9006aa1a" },
  ],
};

const CHIP_FORMATTER = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  weekday: "short",
  month: "short",
  day: "numeric",
});

/** "Mon, Aug 31" — formatted in ET so a UTC build server can't shift the day. */
export function sessionChipLabel(startsAt: string): string {
  return CHIP_FORMATTER.format(new Date(startsAt));
}

/** Full label for screen readers and link titles. */
const FULL_FORMATTER = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  weekday: "long",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

export function sessionFullLabel(startsAt: string): string {
  return FULL_FORMATTER.format(new Date(startsAt));
}

/**
 * Sessions that have not started yet, soonest first. `now` is injected so the
 * page can pass a single render-time value (and tests can pin it).
 */
export function upcomingSessions(
  sessions: PicklParkSession[] | undefined,
  now: Date,
): PicklParkSession[] {
  if (!sessions) return [];
  return sessions
    .filter((s) => new Date(s.startsAt).getTime() > now.getTime())
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
}
