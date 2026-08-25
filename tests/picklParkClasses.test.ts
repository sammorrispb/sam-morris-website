import { describe, expect, it } from "vitest";
import {
  PICKL_PARK_CLASSES,
  classAboutText,
  picklParkClass,
} from "@/lib/picklParkClasses";
import { PICKL_PARK_SESSIONS } from "@/lib/picklParkSessions";

describe("canonical class definitions", () => {
  it("gives every class all three selling fields", () => {
    for (const k of PICKL_PARK_CLASSES) {
      expect(k.forYouIf.length, `${k.id} forYouIf`).toBeGreaterThan(20);
      expect(k.workOn.length, `${k.id} workOn`).toBeGreaterThan(20);
      expect(k.outcome.length, `${k.id} outcome`).toBeGreaterThan(10);
      expect(k.level.length, `${k.id} level`).toBeGreaterThan(0);
    }
  });

  it("uses unique ids and unique venue titles", () => {
    const ids = PICKL_PARK_CLASSES.map((k) => k.id);
    expect(new Set(ids).size).toBe(ids.length);
    const venue = PICKL_PARK_CLASSES.map((k) => k.venueTitle);
    expect(new Set(venue).size).toBe(venue.length);
  });

  // Regression guard: DUPR numbers were removed from level labels on
  // 2026-08-25 because unrated players can't place themselves against them.
  it("keeps rating numbers out of level labels", () => {
    for (const k of PICKL_PARK_CLASSES) {
      expect(k.level, `${k.id} level must not carry a rating number`).not.toMatch(
        /\d\.\d/,
      );
    }
  });

  // The site bans dollar amounts sitewide; this copy feeds the site.
  it("carries no pricing", () => {
    for (const k of PICKL_PARK_CLASSES) {
      const all = `${k.forYouIf} ${k.workOn} ${k.outcome} ${k.level}`;
      expect(all, `${k.id}`).not.toMatch(/\$\d/);
    }
  });

  it("has a session list for every class that claims a cadence", () => {
    for (const k of PICKL_PARK_CLASSES) {
      if (!k.cadence) continue;
      expect(
        PICKL_PARK_SESSIONS[k.id]?.length ?? 0,
        `${k.id} claims a cadence but has no sessions`,
      ).toBeGreaterThan(0);
    }
  });

  it("keys every session list to a real class", () => {
    const ids = new Set(PICKL_PARK_CLASSES.map((k) => k.id));
    for (const key of Object.keys(PICKL_PARK_SESSIONS)) {
      expect(ids.has(key), `session key "${key}" has no class`).toBe(true);
    }
  });
});

describe("classAboutText", () => {
  it("renders every field for pasting into another surface", () => {
    const text = classAboutText("101");
    expect(text).toContain("101 — INTRO TO PICKLEBALL");
    expect(text).toContain("Level: new to the sport.");
    expect(text).toContain("For you if:");
    expect(text).toContain("What you'll work on:");
    expect(text).toContain("You leave with:");
    expect(text).toContain("— Coach Sam");
  });

  it("returns empty for an unknown class rather than throwing", () => {
    expect(classAboutText("nope")).toBe("");
    expect(picklParkClass("nope")).toBeUndefined();
  });
});
