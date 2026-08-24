import { describe, expect, it } from "vitest";
import {
  PICKL_PARK_SESSIONS,
  sessionChipLabel,
  sessionFullLabel,
  upcomingSessions,
  type PicklParkSession,
} from "@/lib/picklParkSessions";

const s = (startsAt: string, eventId = "id-" + startsAt): PicklParkSession => ({
  startsAt,
  eventId,
});

describe("upcomingSessions", () => {
  const now = new Date("2026-09-05T12:00:00-04:00");

  it("drops sessions that already started", () => {
    const out = upcomingSessions(
      [s("2026-08-31T10:00:00-04:00"), s("2026-09-07T10:00:00-04:00")],
      now,
    );
    expect(out.map((x) => x.startsAt)).toEqual(["2026-09-07T10:00:00-04:00"]);
  });

  it("sorts soonest first regardless of input order", () => {
    const out = upcomingSessions(
      [
        s("2026-09-21T10:00:00-04:00"),
        s("2026-09-07T10:00:00-04:00"),
        s("2026-09-14T10:00:00-04:00"),
      ],
      now,
    );
    expect(out.map((x) => x.startsAt)).toEqual([
      "2026-09-07T10:00:00-04:00",
      "2026-09-14T10:00:00-04:00",
      "2026-09-21T10:00:00-04:00",
    ]);
  });

  it("returns empty for undefined, empty, and all-past inputs", () => {
    expect(upcomingSessions(undefined, now)).toEqual([]);
    expect(upcomingSessions([], now)).toEqual([]);
    expect(upcomingSessions([s("2026-01-01T10:00:00-05:00")], now)).toEqual([]);
  });

  it("treats a session starting exactly now as past", () => {
    expect(upcomingSessions([s("2026-09-05T12:00:00-04:00")], now)).toEqual([]);
  });
});

describe("date labels are timezone-safe", () => {
  // Regression guard: a 10am ET session must never render as the previous day
  // on a UTC build server. This is the `new Date(y, m, d)` class of bug.
  it("renders the ET calendar day, not the UTC one", () => {
    expect(sessionChipLabel("2026-08-31T10:00:00-04:00")).toBe("Mon, Aug 31");
    expect(sessionFullLabel("2026-08-31T10:00:00-04:00")).toContain(
      "Monday, August 31",
    );
  });

  it("keeps the ET day for a late-evening session", () => {
    // 8pm ET on Aug 31 is 00:00 UTC on Sep 1 — must still read Aug 31.
    expect(sessionChipLabel("2026-08-31T20:00:00-04:00")).toBe("Mon, Aug 31");
  });
});

describe("PICKL_PARK_SESSIONS data integrity", () => {
  const all = Object.values(PICKL_PARK_SESSIONS).flat();

  it("has a session list for every keyed class", () => {
    expect(Object.keys(PICKL_PARK_SESSIONS).length).toBeGreaterThan(0);
    for (const [id, list] of Object.entries(PICKL_PARK_SESSIONS)) {
      expect(list.length, `${id} has no sessions`).toBeGreaterThan(0);
    }
  });

  it("uses uuids that are unique across every class", () => {
    const ids = all.map((x) => x.eventId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("stores parseable timestamps with an explicit offset", () => {
    for (const session of all) {
      expect(session.startsAt).toMatch(/[+-]\d{2}:\d{2}$/);
      expect(Number.isNaN(new Date(session.startsAt).getTime())).toBe(false);
    }
  });

  it("uses Podplay-shaped uuids", () => {
    for (const session of all) {
      expect(session.eventId).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
      );
    }
  });
});
