# SEO/AEO Backlog — sammorrispb.com

Source of truth for the `seo-daily-sweep` agent. The agent reads this file each run,
picks the highest-priority `[ ]` item with the smallest size, ships one PR, then
moves the item to the **Done log** below.

## Status legend
`[ ]` open · `[~]` in-progress (claimed by today's run) · `[x]` done

## Task fields
- **Priority**: P0 (blocking) / P1 (high value) / P2 (nice-to-have)
- **Type**: schema / content / page / internal-link / technical
- **Size**: S (≤200 LOC diff) / M (200–400 LOC) / L (400+ — agent must split before claiming)

## Hard rules for any work on this repo
- Never reference Dill Dinkers, CourtReserve, linkanddink.com, or The Hub.
- Never push to main directly — always PR.
- Never auto-merge.
- Each city page must have unique substance — coach POV, hand-written. No AI-generated boilerplate.
- Stripe Payment Links are sourced from `src/lib/coaching.ts` PRICING constant (single source of truth — do not duplicate prices).
- `npm run build` must pass before PR.
- JSON-LD must validate via `seo-sweep-state/tools/validate-jsonld.mjs`.

---

## P0 — Foundation Sweep

- [ ] (schema, S) Verify `src/lib/seo.ts` exists with `breadcrumbJsonLd` and `faqJsonLd`. If missing helpers, add them. Reference: schema.org/BreadcrumbList, schema.org/FAQPage.
- [ ] (schema, S) Add BreadcrumbList JSON-LD to `/`, `/about`, `/programs`, `/evaluation`, `/contact`, `/blog`. (Already on `/programs/coaching` and `/quiz`.)
- [ ] (schema, S) Add FAQPage JSON-LD with 4 Qs to `/` (home): pricing, programs offered, scheduling, service area.
- [ ] (schema, S) Add FAQPage JSON-LD with 3 Qs to `/programs`: which program is right for me, age range, refund policy.
- [ ] (schema, M) Add `LocalBusiness` JSON-LD to `src/app/layout.tsx` with NAP (name, address, telephone), `priceRange: "$130-$400"`, and `sameAs: [https://www.nextgenpbacademy.com, https://www.mocopb.com]`. Why: cross-site entity graph + map-pack candidacy.
- [ ] (schema, M) Add `Review` JSON-LD per testimonial in `src/components/TestimonialGrid.tsx`. Parent each Review to the LocalBusiness via `itemReviewed`. Use existing `src/lib/testimonials.ts` data — no new content. Skip aggregateRating until 5+ reviews with public attribution.
- [ ] (technical, S) `/blog` stub hardening: add `robots: { index: false, follow: true }` via `generateMetadata`. Remove `/blog` from `src/app/sitemap.ts` until first post lands.
- [ ] (technical, S) Image alt-text audit on `Footer`, `Nav`, hero blocks in `src/app/page.tsx` and `src/app/about/page.tsx`. Decorative images get `alt=""`; content images get descriptive alt mentioning skill/city keywords.
- [ ] (technical, S) Add `alternates: { canonical: ... }` to `generateMetadata` for every static page that doesn't have one.

## P1 — Content Expansion (`/lessons/[city]` — 8 routes)

Cities approved for Phase 1: rockville, bethesda, north-bethesda, potomac, gaithersburg, silver-spring, germantown, olney.

- [ ] (page, M) Create `src/lib/cities.ts` (slim port from mocopb's cities.ts — name/slug/short description). **Hand-written coach POV per city, not generated.** Sam's voice is the differentiator.
- [ ] (page, M) Add `/lessons/rockville`. H1: "Private Pickleball Lessons in Rockville, MD". 600–800 words. LeadForm + Stripe Payment Link CTAs (`SINGLE_LESSON_LINK`/`FOUR_PACK_LINK` from `src/lib/coaching.ts`). 3-Q city-specific FAQ. Service schema with `areaServed: City`. BreadcrumbList. Cross-link to mocopb `/play/rockville` and NGA `/montgomery-county-youth-pickleball`. Register via `generateStaticParams` + sitemap.
- [ ] (page, M) Add `/lessons/bethesda`. Same template. Hand-written city description.
- [ ] (page, M) Add `/lessons/north-bethesda`. Same template.
- [ ] (page, M) Add `/lessons/potomac`. Same template.
- [ ] (page, M) Add `/lessons/gaithersburg`. Same template.
- [ ] (page, M) Add `/lessons/silver-spring`. Same template.
- [ ] (page, M) Add `/lessons/germantown`. Same template.
- [ ] (page, M) Add `/lessons/olney`. Same template. (Sam's home base — should be the strongest city page.)

## P2 — AEO Depth (`/learn` hub)

- [ ] (page, M) Add `/learn/skill-levels`. Title: "Pickleball Skill Levels Explained: 2.0 to 5.0+". Definition table per DUPR/UTPR rating, behavioral markers per level, "what to work on next" per level. `DefinedTermSet` + `Article` schema. Cross-link to `/quiz` and `/programs/coaching`.
- [ ] (page, M) Add `/learn/ease-framework`. Title: "The EASE Framework — How Coach Sam Develops Pickleball Players". Sam's methodology (Energy / Awareness / Skills / Edge). `HowTo` schema for the 4-step sequence. **Citation-bait — every coach searches this, nobody owns it.** Approved 2026-05-06 for full publish.
- [ ] (page, M) Add `/learn/dink-vs-drive`. Technique page with `HowTo` schema + embedded video (reuse `VideoObject` pattern from `/about`).
- [ ] (page, M) Add `/learn/third-shot-options`. Technique page (drop / drive / lob). `HowTo` schema + video.
- [ ] (page, S) Add `/learn` hub with `CollectionPage` schema linking all 4 child pages. Link from `/programs/coaching` and footer.
- [ ] (internal-link, S) Cross-site `sameAs` audit: every `Person`/`Organization`/`LocalBusiness` JSON-LD on this site references nextgenpbacademy.com + mocopb.com in `sameAs`.

---

## Done log (auto-pruned at 30 days)

_(Empty — agent appends entries here as it ships PRs.)_
