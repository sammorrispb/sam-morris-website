/**
 * Quiz scoring is pure logic — lock the level boundaries and result shape so a
 * future copy/scoring edit can't silently misroute players.
 */
import { describe, expect, it } from "vitest";
import {
  QUIZ_QUESTIONS,
  QUIZ_RESULTS,
  calculateResult,
} from "@/lib/quiz";

const N = QUIZ_QUESTIONS.length;
const allOf = (points: number) => Array(N).fill(points);

describe("quiz calculateResult", () => {
  it("all-lowest answers → beginner", () => {
    expect(calculateResult(allOf(0))).toBe("beginner");
  });

  it("all-highest answers → advanced", () => {
    expect(calculateResult(allOf(3))).toBe("advanced");
  });

  it("mid-low answers → advanced-beginner", () => {
    // pct = (1*N)/(3*N) = 0.33 → (0.25, 0.5] bucket
    expect(calculateResult(allOf(1))).toBe("advanced-beginner");
  });

  it("mid-high answers → intermediate", () => {
    // pct = (2*N)/(3*N) = 0.66 → (0.5, 0.75] bucket
    expect(calculateResult(allOf(2))).toBe("intermediate");
  });

  it("only ever returns a key that exists in QUIZ_RESULTS", () => {
    for (let p = 0; p <= 3; p++) {
      expect(QUIZ_RESULTS[calculateResult(allOf(p))]).toBeDefined();
    }
  });
});

describe("quiz result content", () => {
  it("every result has a level, DUPR band, description, and at least one program", () => {
    for (const [key, r] of Object.entries(QUIZ_RESULTS)) {
      expect(r.level, `${key}.level`).toBeTruthy();
      expect(r.dupr, `${key}.dupr`).toBeTruthy();
      expect(r.description.length, `${key}.description`).toBeGreaterThan(20);
      expect(r.programs.length, `${key}.programs`).toBeGreaterThan(0);
    }
  });

  it("result copy stays in first person (no 'we'll'/'our' coach voice)", () => {
    for (const [key, r] of Object.entries(QUIZ_RESULTS)) {
      expect(r.description, `${key}.description uses 'we'`).not.toMatch(/\bwe'll\b/i);
      for (const p of r.programs) {
        expect(p.description, `${key} program uses 'our'`).not.toMatch(
          /\bour best-value\b/i,
        );
      }
    }
  });
});
