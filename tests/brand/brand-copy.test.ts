/**
 * Brand-guardrail regression suite (static / source-level).
 *
 * Scans the user-facing source (pages, components, copy libs) for phrases the
 * Coach Sam brand guide + DD/CR decoupling rules forbid, and asserts the
 * reclaimed tagline is present where it must be. These are the exact
 * regressions fixed in the 2026-06-09 brand review (PR #63) — this suite
 * keeps them from silently coming back.
 *
 * Pure file reads, no server boot — runs in the fast default `test` pass.
 */
import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.resolve(here, "..", "..", "src");

/** Recursively collect every .ts/.tsx file under src/, excluding admin-only UI. */
function collectSourceFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) {
      out.push(...collectSourceFiles(full));
    } else if (/\.(ts|tsx)$/.test(entry)) {
      out.push(full);
    }
  }
  return out;
}

const ALL_FILES = collectSourceFiles(SRC);

/** Read a file's text by src-relative path. */
function read(relPath: string): string {
  return readFileSync(path.join(SRC, relPath), "utf8");
}

// Phrases that must NEVER appear in user-facing source. Each is a real brand
// violation caught in the review.
const BANNED: { label: string; pattern: RegExp }[] = [
  {
    label: "NGA tagline borrowed for the Coach Sam brand",
    pattern: /better than yesterday/i,
  },
  {
    label: "L&D tagline borrowed for the Coach Sam brand",
    pattern: /\bplay up\b/i,
  },
  {
    label: "Dill Dinkers 'Director of Programming' title (terminated role)",
    pattern: /director of programming/i,
  },
  {
    label: "unverified 'three-time founder' claim",
    pattern: /three-time founder/i,
  },
  {
    label: "internal 'Coach Up' program name leaked onto the personal site",
    pattern: /coach up training/i,
  },
  {
    label: "Dill Dinkers reference",
    pattern: /dill\s?dinkers/i,
  },
  {
    label: "CourtReserve reference",
    pattern: /courtreserve|court reserve/i,
  },
  {
    label: "retired mocopb.com reference",
    pattern: /mocopb/i,
  },
  {
    label: "banned competitor paddle brand (JOOLA is exclusive)",
    pattern: /selkirk|paddletek/i,
  },
  {
    // The free 30-minute skill evaluation was discontinued 2026-08-24 — the
    // /evaluation page, its API route, and every CTA came out with it. Copy
    // must never re-advertise it; the primary CTA is the private-lesson
    // request flow (COACH_REQUEST_URL).
    label: "retired free-evaluation offer",
    pattern: /free[\s-]*(30[\s-]*minute\s+)?(skill\s+|pickleball\s+)?eval/i,
  },
  {
    label: "link to the retired /evaluation route",
    pattern: /href=(?:"|'|\{")\/evaluation/i,
  },
];

describe("brand guardrails — banned phrases", () => {
  for (const { label, pattern } of BANNED) {
    it(`no source file contains: ${label}`, () => {
      const offenders = ALL_FILES.filter((f) => pattern.test(readFileSync(f, "utf8")));
      expect(
        offenders.map((f) => path.relative(SRC, f)),
        `Found banned phrase /${pattern.source}/ in: ${offenders.join(", ")}`,
      ).toEqual([]);
    });
  }
});

describe("brand guardrails — required Coach Sam tagline", () => {
  it("the reclaimed tagline anchors the footer", () => {
    expect(read("components/Footer.tsx")).toMatch(
      /Helping families grow through sport/i,
    );
  });

  it("the reclaimed tagline anchors the home hero", () => {
    expect(read("app/page.tsx")).toMatch(/Helping families grow through sport/i);
  });
});

describe("brand guardrails — pricing is single-sourced (no hard-coded $ in copy)", () => {
  // Pricing lives only in src/lib/coaching.ts as the PRICING constant. No other
  // user-facing file may hard-code a dollar amount in copy.
  const PRICE_IN_COPY = /\$\d/;
  const ALLOW = new Set(["lib/coaching.ts"]);

  it("only coaching.ts contains literal dollar amounts", () => {
    const offenders = ALL_FILES.filter((f) => {
      const rel = path.relative(SRC, f);
      if (ALLOW.has(rel)) return false;
      return PRICE_IN_COPY.test(readFileSync(f, "utf8"));
    }).map((f) => path.relative(SRC, f));
    expect(offenders, `Hard-coded prices found in: ${offenders.join(", ")}`).toEqual([]);
  });
});
