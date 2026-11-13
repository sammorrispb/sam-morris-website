import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as cheerio from "cheerio";
import { describe, expect, it, vi } from "vitest";
import HomePage from "@/app/page";
import CoachingPage from "@/app/programs/coaching/page";

vi.stubGlobal("React", React);

function expectGroupDestination(href: string | undefined, content: string) {
  const url = new URL(href ?? "");
  expect(url.origin).toBe("https://www.linkanddink.com");
  expect(url.pathname).toBe("/play/bracket");
  expect(url.searchParams.get("utm_source")).toBe("sammorrispb");
  expect(url.searchParams.get("utm_medium")).toBe("cross_family_nav");
  expect(url.searchParams.get("utm_campaign")).toBe("family_reciprocal");
  expect(url.searchParams.get("utm_content")).toBe(content);
  expect(url.searchParams.get("ref")).toBe("sammorrispb_footer_ld");
}

describe("next shot links into local play", () => {
  it("home's existing local-group link opens bracket selection with body attribution", () => {
    const $ = cheerio.load(renderToStaticMarkup(<HomePage />));
    const link = $("a").filter((_, el) => $(el).text().includes("Join a local group"));
    expect(link).toHaveLength(1);
    expectGroupDestination(link.attr("href"), "home_local_group");
    expect(link.attr("target")).toBe("_blank");
    expect(link.attr("rel")).toBe("noopener noreferrer");
  });

  it("coaching offers one practice sentence after lesson requests, linked to bracket selection", () => {
    const $ = cheerio.load(renderToStaticMarkup(<CoachingPage />));
    const link = $("a").filter((_, el) => $(el).text().trim() === "find a local group through Link & Dink");
    expect(link).toHaveLength(1);
    expect(link.closest("p").text().replace(/\s+/g, " ").trim()).toBe(
      "Practice between lessons: find a local group through Link & Dink.",
    );
    expectGroupDestination(link.attr("href"), "coaching_between_lessons");
    expect(link.attr("target")).toBe("_blank");
    expect(link.attr("rel")).toBe("noopener noreferrer");
    expect($("#ready-to-start").find("[data-lesson-link]")).toHaveLength(1);
    expect($("#ready-to-start").find("a").last().attr("href")).toBe(link.attr("href"));
  });
});
