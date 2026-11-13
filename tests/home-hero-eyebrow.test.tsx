import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as cheerio from "cheerio";
import { describe, expect, it, vi } from "vitest";
import HomePage from "@/app/page";

vi.stubGlobal("React", React);

// docs/brand-guide.md (note of 2026-08-24): "Coach. Dad." is the brand line and
// sits in the home hero eyebrow, the footer eyebrow and the About h1. The home
// lost it when the landing was simplified; this keeps it there, above a
// headline that stays the local search phrase.
describe("home hero brand line", () => {
  const $ = cheerio.load(renderToStaticMarkup(<HomePage />));
  const h1 = $("h1");

  it("the hero opens with the brand line as an eyebrow, directly above the headline", () => {
    const eyebrow = h1.prev("p.eyebrow");
    expect(eyebrow).toHaveLength(1);
    expect(eyebrow.text().trim()).toBe("Coach. Dad.");
  });

  it("the headline is still the one h1 and still the search phrase", () => {
    expect(h1).toHaveLength(1);
    expect(h1.text().replace(/\s+/g, " ").trim()).toBe(
      "Pickleball coach in Montgomery County & Frederick, MD.",
    );
    expect(h1.text()).not.toContain("Coach. Dad.");
  });
});
