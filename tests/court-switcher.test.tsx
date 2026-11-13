/**
 * Footer court switcher: the wayfinding block that replaced the old footer
 * column of family links. It shows Sam's owned sites as court service boxes.
 * The site you are on is lit and is not a link; the others open in a new tab
 * with explicit `switcher_<dest>` attribution.
 *
 * Static render with cheerio (same precedent as tests/lesson-link.test.tsx),
 * no server boot, so this runs in the default `npm test` pass CI gates on.
 */
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as cheerio from "cheerio";
import { describe, expect, it, vi } from "vitest";
import { CourtSwitcher } from "@/components/CourtSwitcher";
import { COURT_SWITCHER_LABEL, FAMILY_CORNERS } from "@/lib/constants";

vi.stubGlobal("React", React);

function render() {
  return cheerio.load(renderToStaticMarkup(<CourtSwitcher />));
}

describe("court switcher: the list", () => {
  it("is exactly three corners in a fixed order, names only", () => {
    expect(FAMILY_CORNERS.map((c) => c.id)).toEqual(["sammorrispb", "nga", "ld"]);
    expect(FAMILY_CORNERS.map((c) => c.name)).toEqual([
      "Coach Sam",
      "Next Gen Pickleball Academy",
      "Link & Dink",
    ]);
  });

  it("only the current site has no destination", () => {
    expect(FAMILY_CORNERS.filter((c) => !c.dest).map((c) => c.id)).toEqual(["sammorrispb"]);
    expect(FAMILY_CORNERS.filter((c) => c.dest).map((c) => c.dest)).toEqual(["nga", "ld"]);
  });
});

describe("court switcher: rendered", () => {
  it("is a nav landmark with an accessible name", () => {
    const $ = render();
    const nav = $("nav");
    expect(nav).toHaveLength(1);
    expect(COURT_SWITCHER_LABEL.trim().length).toBeGreaterThan(0);
    expect(nav.attr("aria-label")).toBe(COURT_SWITCHER_LABEL);
    // The old column heading is gone; the landmark name does the job.
    expect($("h1, h2, h3, h4, h5, h6")).toHaveLength(0);
  });

  it("renders exactly three boxes, in list order at every width", () => {
    const $ = render();
    const boxes = $("[data-corner]");
    expect(boxes).toHaveLength(3);
    expect(boxes.map((_, el) => $(el).attr("data-corner")).get()).toEqual([
      "sammorrispb",
      "nga",
      "ld",
    ]);
    // Order comes from the DOM alone: no CSS reordering at any breakpoint.
    expect($.html()).not.toMatch(/\b(?:[a-z]+:)?(?:order-|flex-(?:row|col)-reverse)/);
  });

  it("the current site's box is marked current and is not a link", () => {
    const $ = render();
    const current = $('[aria-current="page"]');
    expect(current).toHaveLength(1);
    const box = current.closest("[data-corner]");
    expect(box.attr("data-corner")).toBe("sammorrispb");
    expect(box.text().trim()).toBe("Coach Sam");
    expect(box.find("a")).toHaveLength(0);
    expect(box.find("[href]")).toHaveLength(0);
    expect(box.find("[tabindex]")).toHaveLength(0);
    expect(box.attr("tabindex")).toBeUndefined();
    expect(box.find("button, [role='link'], [role='button']")).toHaveLength(0);
  });

  it("exactly two anchors, one per sibling site, with switcher attribution", () => {
    const $ = render();
    const anchors = $("a");
    expect(anchors).toHaveLength(2);

    const expected: Record<string, string> = {
      nga: "nextgenpbacademy.com",
      ld: "www.linkanddink.com",
    };
    const seen: string[] = [];
    anchors.each((_, el) => {
      const a = $(el);
      const dest = a.closest("[data-corner]").attr("data-corner") ?? "";
      seen.push(dest);
      const url = new URL(a.attr("href") ?? "");
      expect(url.protocol).toBe("https:");
      expect(url.host).toBe(expected[dest]);
      expect(url.pathname).toBe("/");
      expect(url.searchParams.get("utm_source")).toBe("sammorrispb");
      expect(url.searchParams.get("utm_medium")).toBe("cross_family_nav");
      expect(url.searchParams.get("utm_content")).toBe(`switcher_${dest}`);
      expect(a.attr("target")).toBe("_blank");
      expect(a.attr("rel")).toBe("noopener noreferrer");
      expect(a.attr("tabindex")).toBeUndefined();
      // New-tab cue is in the accessible name, hidden from sighted layout.
      const cue = a.find(".sr-only");
      expect(cue).toHaveLength(1);
      expect(cue.text()).toBe("(opens in a new tab)");
    });
    expect(seen).toEqual(["nga", "ld"]);
  });

  it("uses the full academy name and the community name", () => {
    const $ = render();
    expect($('[data-corner="nga"]').text()).toContain("Next Gen Pickleball Academy");
    expect($('[data-corner="ld"]').text()).toContain("Link & Dink");
  });

  it("does not show a fourth site", () => {
    const $ = render();
    const text = $.root().text();
    // Positive control: the scan is reading real rendered copy.
    expect(text).toContain("Link & Dink");
    expect(text).not.toMatch(/game\s*on/i);
    expect($.html()).not.toMatch(/game[\s_-]*on/i);
  });
});
