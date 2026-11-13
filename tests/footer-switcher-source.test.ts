/**
 * Source-level pins around the footer court switcher. Kept apart from the
 * render test (tests/court-switcher.test.tsx) so these do not depend on the
 * switcher component importing cleanly.
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { familyMarketingRef, familySiteUrl } from "@/lib/urls";

const here = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.resolve(here, "..", "src");
const read = (rel: string): string => readFileSync(path.join(SRC, rel), "utf8");

describe("footer: the old family-links column is gone", () => {
  const footer = read("components/Footer.tsx");

  it("positive control: the scan read the real footer", () => {
    expect(footer).toMatch(/Helping families grow through sport/);
    expect(footer).toContain("export function Footer");
  });

  it("no longer carries the old column label, in any casing", () => {
    expect(footer).not.toMatch(/sister\s+sites/i);
  });

  it("renders the court switcher once, in its own row", () => {
    expect(footer.match(/<CourtSwitcher\b/g)?.length).toBe(1);
  });

  it("builds no family link itself (the switcher owns them)", () => {
    expect(footer).not.toMatch(/familySiteUrl|familyMarketingRef/);
  });
});

describe("familySiteUrl default attribution was not flipped", () => {
  // The switcher passes its own content; every other call site (the home page
  // body link, /programs) relies on this default staying `footer_<dest>`.
  for (const dest of ["nga", "ld"] as const) {
    it(`${dest}: no content passed keeps footer_${dest} and the footer ref`, () => {
      const url = new URL(familySiteUrl(dest));
      expect(url.searchParams.get("utm_medium")).toBe("cross_family_nav");
      expect(url.searchParams.get("utm_content")).toBe(`footer_${dest}`);
      expect(url.searchParams.get("ref")).toBe(`sammorrispb_footer_${dest}`);
      expect(familyMarketingRef(dest)).toBe(`sammorrispb_footer_${dest}`);
    });
  }

  it("an explicit content wins, and the ref is unchanged", () => {
    const url = new URL(familySiteUrl("ld", "/", { content: "switcher_ld" }));
    expect(url.searchParams.get("utm_content")).toBe("switcher_ld");
    expect(url.searchParams.get("ref")).toBe("sammorrispb_footer_ld");
  });
});
