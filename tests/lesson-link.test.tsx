/**
 * Lesson link guardrails.
 *
 * Lesson and cohort requests are handled on coach.linkanddink.com. Until
 * 2026-11-12 the site linked to a host on its own domain that only redirected
 * there, so a visitor landed on a different site with no warning. Three things
 * are pinned here:
 *
 *   1. the links go straight to the real host, same paths and params;
 *   2. every in-body lesson button renders through <LessonLink>, which always
 *      prints the visible handoff line next to the button;
 *   3. the request URLs are referenced only by that component, their
 *      definitions and a short list of exempt surfaces (nav, sticky bar,
 *      footer strip, quiz result, plain-text email).
 *
 * Source scans plus static renders, no server boot: this runs in the default
 * `npm test` pass, which is the one CI gates on.
 */
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as cheerio from "cheerio";
import { describe, expect, it, vi } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import {
  COACH_REQUEST_URL,
  COHORT_POOL_URL,
  LESSON_HANDOFF_NOTE,
  LESSON_REQUEST_HOST,
} from "@/lib/constants";
import { coachRequestUrl } from "@/lib/urls";
import { COACHING_FAQS } from "@/lib/coachingFaq";
import { faqJsonLd } from "@/lib/seo";
import { LessonLink } from "@/components/LessonLink";

vi.stubGlobal("React", React);

const here = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.resolve(here, "..", "src");

const REAL_HOST = "coach.linkanddink.com";
const RETIRED_HOST = "coach.sammorrispb.com";

function collectSourceFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...collectSourceFiles(full));
    else if (/\.(ts|tsx)$/.test(entry)) out.push(full);
  }
  return out;
}

const ALL_FILES = collectSourceFiles(SRC);
const rel = (file: string): string => path.relative(SRC, file).split(path.sep).join("/");
const SOURCES = new Map(ALL_FILES.map((f) => [rel(f), readFileSync(f, "utf8")]));

describe("lesson links go straight to the real host", () => {
  it("COACH_REQUEST_URL is the private-lesson request page, no query", () => {
    const url = new URL(COACH_REQUEST_URL);
    expect(url.protocol).toBe("https:");
    expect(url.host).toBe(REAL_HOST);
    expect(url.pathname).toBe("/book/private-lesson");
    expect(url.search).toBe("");
  });

  it("COHORT_POOL_URL is the adult cohort pool", () => {
    const url = new URL(COHORT_POOL_URL);
    expect(url.protocol).toBe("https:");
    expect(url.host).toBe(REAL_HOST);
    expect(url.pathname).toBe("/cohorts/join");
    expect([...url.searchParams.entries()]).toEqual([["track", "adult"]]);
  });

  it("coachRequestUrl() keeps the path and exactly the four UTM params", () => {
    const url = new URL(coachRequestUrl("programs_footer_cta"));
    expect(url.host).toBe(REAL_HOST);
    expect(url.pathname).toBe("/book/private-lesson");
    expect([...url.searchParams.entries()]).toEqual([
      ["utm_source", "sammorrispb"],
      ["utm_medium", "website"],
      ["utm_campaign", "lesson_cta"],
      ["utm_content", "programs_footer_cta"],
    ]);
  });

  it("the handoff line names the site the link actually opens", () => {
    expect(LESSON_REQUEST_HOST).toBe(REAL_HOST);
    expect(LESSON_HANDOFF_NOTE).toBe(
      "Opens Coach Sam's lesson request page on linkanddink.com.",
    );
    const named = LESSON_HANDOFF_NOTE.match(/on ([a-z0-9.-]+\.[a-z]+)\.$/)?.[1];
    expect(named).toBe("linkanddink.com");
    expect(LESSON_REQUEST_HOST.endsWith(`.${named}`)).toBe(true);
  });
});

describe("<LessonLink> always renders the button and the handoff line together", () => {
  const BTN = "btn-gradient px-8";

  function render(node: React.ReactElement) {
    return cheerio.load(renderToStaticMarkup(node));
  }

  function expectOneLessonAnchorAndNote($: cheerio.CheerioAPI, href: string) {
    expect($("a")).toHaveLength(1);
    const a = $("a").first();
    expect(a.attr("href")).toBe(href);
    expect(new URL(a.attr("href") ?? "").host).toBe(REAL_HOST);
    const note = $("[data-lesson-handoff]");
    expect(note).toHaveLength(1);
    expect(note.text()).toBe(LESSON_HANDOFF_NOTE);
    // The line is tied to the button for assistive tech, not just nearby.
    expect(note.attr("id")).toBeTruthy();
    expect(a.attr("aria-describedby")).toBe(note.attr("id"));
    return a;
  }

  it("default: bare lesson URL, same tab, label and classes passed through", () => {
    const $ = render(
      <LessonLink className={BTN}>Request a private lesson</LessonLink>,
    );
    const a = expectOneLessonAnchorAndNote($, COACH_REQUEST_URL);
    expect(a.text()).toBe("Request a private lesson");
    expect(a.attr("class")).toBe(BTN);
    expect(a.attr("target")).toBeUndefined();
  });

  it("content stamps the UTM-tagged lesson URL", () => {
    const $ = render(
      <LessonLink className={BTN} content="pickl_park_private">Request</LessonLink>,
    );
    expectOneLessonAnchorAndNote($, coachRequestUrl("pickl_park_private"));
  });

  it("newTab opens a new tab safely", () => {
    const $ = render(
      <LessonLink className={BTN} newTab>Request a Lesson</LessonLink>,
    );
    const a = expectOneLessonAnchorAndNote($, COACH_REQUEST_URL);
    expect(a.attr("target")).toBe("_blank");
    expect(a.attr("rel")).toBe("noopener noreferrer");
  });

  it("kind=cohort points at the cohort pool", () => {
    const $ = render(
      <LessonLink className={BTN} kind="cohort">Join the cohort pool</LessonLink>,
    );
    const a = expectOneLessonAnchorAndNote($, COHORT_POOL_URL);
    expect(a.attr("target")).toBeUndefined();
  });

  it("external_link tracking keeps the new-tab behaviour of TrackedExternalLink", () => {
    const $ = render(
      <LessonLink
        className={BTN}
        tracking={{ event: "external_link", label: "Request a Lesson", page: "coaching" }}
      >
        Request a Lesson
      </LessonLink>,
    );
    const a = expectOneLessonAnchorAndNote($, COACH_REQUEST_URL);
    expect(a.attr("target")).toBe("_blank");
    expect(a.attr("rel")).toBe("noopener noreferrer");
    expect(a.attr("class")).toBe(BTN);
  });

  it("cta_click tracking renders one same-tab anchor to the tagged URL", () => {
    const $ = render(
      <LessonLink
        className={BTN}
        content="programs_footer_cta"
        tracking={{ event: "cta_click", label: "Request a Lesson", page: "programs", section: "footer_cta" }}
      >
        Request a Lesson
      </LessonLink>,
    );
    const a = expectOneLessonAnchorAndNote($, coachRequestUrl("programs_footer_cta"));
    expect(a.attr("target")).toBeUndefined();
    expect(a.attr("class")).toBe(BTN);
  });

  it("wrapperClassName replaces the default wrapper layout", () => {
    const $ = render(
      <LessonLink className={BTN} wrapperClassName="flex flex-col items-stretch gap-2">x</LessonLink>,
    );
    expect($("[data-lesson-link]").attr("class")).toBe("flex flex-col items-stretch gap-2");
  });
});

describe("request URLs are only referenced where the handoff rule allows", () => {
  const REFERENCE = /COACH_REQUEST_URL|COHORT_POOL_URL|coachRequestUrl/;

  // Where the URLs are defined or derived.
  const DEFINITIONS = ["lib/constants.ts", "lib/urls.ts"];
  // The one component every in-body lesson button renders through.
  const COMPONENT = "components/LessonLink.tsx";
  // Exempt by rule: persistent chrome, quiz result data and plain-text email.
  // These link to the lesson host without the handoff line.
  const EXEMPT = [
    "components/Nav.tsx",
    "components/MobileCTA.tsx",
    "components/Footer.tsx",
    "components/QuizClient.tsx",
    "lib/quiz.ts",
    "lib/emailTemplates.ts",
  ];

  // Every in-body lesson button, per page. A dropped or added one fails here
  // on purpose: update the number in the same change as the page.
  const IN_BODY_USAGES: Record<string, number> = {
    "app/about/page.tsx": 1,
    "app/programs/coaching/page.tsx": 4,
    "app/programs/page.tsx": 2,
    "app/programs/pickl-park/page.tsx": 1,
    "app/programs/cohort/page.tsx": 3,
  };

  const referencing = [...SOURCES].filter(([, text]) => REFERENCE.test(text)).map(([f]) => f);

  it("positive control: the scan read real source files", () => {
    expect(ALL_FILES.length).toBeGreaterThan(40);
    expect(SOURCES.get("lib/constants.ts")).toContain("export const COACH_REQUEST_URL");
    expect(SOURCES.get("lib/constants.ts")).toContain("export const COHORT_POOL_URL");
    expect(SOURCES.get("lib/urls.ts")).toContain("export function coachRequestUrl");
    // Every allowlisted file exists and really does reference a request URL,
    // so a stale entry cannot sit here unnoticed.
    for (const file of [...DEFINITIONS, COMPONENT, ...EXEMPT]) {
      expect(referencing, `${file} should reference a request URL`).toContain(file);
    }
  });

  it("only the component, the definitions and the exempt list reference the request URLs", () => {
    const allowed = new Set([...DEFINITIONS, COMPONENT, ...EXEMPT]);
    expect(referencing.filter((f) => !allowed.has(f))).toEqual([]);
  });

  it("each page renders its pinned number of in-body lesson buttons through <LessonLink>", () => {
    const actual: Record<string, number> = {};
    for (const [file, text] of SOURCES) {
      // JSX only lives in .tsx; .ts files mention the tag in comments.
      if (file === COMPONENT || !file.endsWith(".tsx")) continue;
      const count = text.match(/<LessonLink\b/g)?.length ?? 0;
      if (count > 0) actual[file] = count;
    }
    expect(actual).toEqual(IN_BODY_USAGES);
    expect(Object.values(actual).reduce((a, b) => a + b, 0)).toBe(11);
  });

  it("the lesson host is written out in constants.ts and nowhere else", () => {
    // Closes the gap the allowlist leaves: a raw anchor with the host typed
    // inline never touches a constant, so it would pass the scan above.
    const offenders = [...SOURCES]
      .filter(([file, text]) => file !== "lib/constants.ts" && /coach\.linkanddink\.com/i.test(text))
      .map(([f]) => f);
    expect(offenders).toEqual([]);
    expect(SOURCES.get("lib/constants.ts")).toMatch(/coach\.linkanddink\.com/);
  });

  it("LESSON_REQUEST_HOST is only used to name the host in FAQ copy", () => {
    // It is not a link target. A page that built its own lesson URL from it
    // would slip past the allowlist above, so its consumers are pinned too.
    const users = [...SOURCES].filter(([, t]) => /LESSON_REQUEST_HOST/.test(t)).map(([f]) => f).sort();
    expect(users).toEqual(["lib/coachingFaq.ts", "lib/constants.ts"]);
  });

  it("no source file still names the retired redirect host", () => {
    const offenders = [...SOURCES]
      .filter(([, text]) => text.toLowerCase().includes(RETIRED_HOST))
      .map(([f]) => f);
    expect(offenders).toEqual([]);
  });
});

describe("/programs/coaching FAQ structured data names the real host", () => {
  const json = JSON.stringify(faqJsonLd(COACHING_FAQS));

  it("the booking answer names the real host, derived from the constant", () => {
    expect(COACHING_FAQS.length).toBe(4);
    const booking = COACHING_FAQS.find((f) => f.question === "How do I book a private pickleball lesson?");
    expect(booking?.answer).toContain(`Request a lesson at ${REAL_HOST} and Sam will confirm`);
    expect(json).not.toContain(RETIRED_HOST);
    expect(json).not.toContain("sammorrispb.com");
  });

  it("the page builds its FAQPage block from that list, not an inline copy", () => {
    const page = SOURCES.get("app/programs/coaching/page.tsx") ?? "";
    expect(page).toMatch(/faqJsonLd\(\s*COACHING_FAQS\s*\)/);
    expect(page).not.toContain('"FAQPage"');
  });
});
