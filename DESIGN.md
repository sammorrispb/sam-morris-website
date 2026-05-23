---
name: Sam Morris — Coach Sam
description: Personal coaching brand for sammorrispb.com. Coach. Builder. Dad. Warm premium charcoal + amber/sienna/sage — distinct from NGA's cool navy/teal and L&D's spruce/lime.
version: alpha
colors:
  background: "#0F0E0C"
  surface: "#1B1815"
  surface-warm: "#25201B"
  primary: "#E8A03A"
  primary-deep: "#C77327"
  on-primary: "#1B1815"
  secondary: "#B85C2F"
  on-secondary: "#F4ECE0"
  tertiary: "#D9523E"
  on-tertiary: "#1B1815"
  accent-sage: "#A5C49C"
  on-accent-sage: "#1B1815"
  accent-amber-light: "#F2C078"
  on-background: "#F4ECE0"
  on-background-muted: "#A89F8E"
  success: "#A5C49C"
  on-success: "#1B1815"
  error: "#D9523E"
  on-error: "#1B1815"
typography:
  hero:
    fontFamily: Montserrat
    fontSize: 3rem
    fontWeight: "800"
    lineHeight: 1.1
    letterSpacing: -0.02em
  h1:
    fontFamily: Montserrat
    fontSize: 2.25rem
    fontWeight: "800"
    lineHeight: 1.2
  h2:
    fontFamily: Montserrat
    fontSize: 1.875rem
    fontWeight: "700"
    lineHeight: 1.25
  h3:
    fontFamily: Montserrat
    fontSize: 1.5rem
    fontWeight: "700"
    lineHeight: 1.375
  body-lg:
    fontFamily: Inter
    fontSize: 1.125rem
    fontWeight: "400"
    lineHeight: 1.5
  body-md:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: "400"
    lineHeight: 1.5
  body-sm:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: "400"
    lineHeight: 1.5
  label:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: "600"
    lineHeight: 1.25
  label-caps:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: "600"
    lineHeight: 1.25
    letterSpacing: 0.08em
  eyebrow:
    fontFamily: Roboto Mono
    fontSize: 0.75rem
    fontWeight: "400"
    lineHeight: 1.25
    letterSpacing: 0.18em
  numeric:
    fontFamily: Roboto Mono
    fontSize: 1rem
    fontWeight: "700"
    lineHeight: 1.25
  price:
    fontFamily: Roboto Mono
    fontSize: 1.5rem
    fontWeight: "700"
    lineHeight: 1.25
rounded:
  sm: 4px
  md: 8px
  lg: 1rem
  xl: 1.25rem
  full: 9999px
spacing:
  s-1: 4px
  s-2: 8px
  s-3: 12px
  s-4: 16px
  s-6: 24px
  s-8: 32px
  s-12: 48px
  s-16: 64px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    height: 48px
    padding: 0 24px
  button-primary-hover:
    backgroundColor: "{colors.primary-deep}"
    textColor: "{colors.on-primary}"
  button-ember:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.on-tertiary}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    height: 48px
    padding: 0 24px
  button-outline:
    backgroundColor: "{colors.background}"
    textColor: "{colors.on-background}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    height: 48px
  card-warm:
    backgroundColor: "{colors.surface-warm}"
    textColor: "{colors.on-background}"
    rounded: "{rounded.lg}"
    padding: 24px
  card-warm-featured:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-background}"
    rounded: "{rounded.lg}"
    padding: 24px
  card-blog:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-background}"
    rounded: "{rounded.lg}"
    padding: 24px
  card-credential:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-background}"
    rounded: "{rounded.md}"
    padding: 16px
  badge-ease:
    backgroundColor: "{colors.accent-sage}"
    textColor: "{colors.on-accent-sage}"
    typography: "{typography.label-caps}"
    rounded: "{rounded.full}"
    padding: 4px 12px
  badge-credential:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-caps}"
    rounded: "{rounded.full}"
    padding: 4px 12px
  tag-pill:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    typography: "{typography.label-caps}"
    rounded: "{rounded.full}"
    padding: 4px 12px
  input-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-background}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    height: 48px
    padding: 0 16px
---

## Overview

This is the visual identity for **sammorrispb.com** — Sam Morris's personal
coaching practice in Montgomery County, MD. Sam is a coach, builder, and dad:
9 years as a PE teacher (M.S. Coaching from Ball State), 5.0+ player,
RPO/PPR/DUPR certified, co-founder of Next Gen Academy.

The brand is **premium warm charcoal**, not navy. It deliberately diverges
from NGA's cool athletic-tech palette and from L&D's spruce-and-lime heritage
look. The look is closer to a craft-coffee bar than to a sports app — earned,
warm, unhurried. Amber and burnt sienna as the action colors; sage as the
moment EASE shows up; cream text on warm cocoa.

The voice is **The Coach**: friendly yet direct, empathetic and action-
oriented, strategic but human, up-tempo and encouraging. Coach energy, not
corporate energy.

Core methodology: **EASE** — Ethics, Attitude, Skills, Excellence. Sage
appears only where EASE surfaces.

## Colors

The palette is warm and tonal — cocoa grounds, amber/sienna accents, sage as
the singular cool note. The three CTA tones (amber, ember, outline) ladder by
urgency rather than hierarchy.

- **`background` (#0F0E0C):** Deep warm charcoal. The page ground. Not navy,
  not pure black — the warm undertone is load-bearing.
- **`surface` (#1B1815):** Cocoa. Card surfaces, alt sections.
- **`surface-warm` (#25201B):** A half-step lighter cocoa for stacked cards
  and warm-card backgrounds (gradient base for `card-warm`).
- **`primary` (#E8A03A):** Amber / honey gold. The brand's signature accent.
  Primary CTAs, eyebrow text, focus rings, tag pills, gradient origin.
- **`primary-deep` (#C77327):** Deeper amber. The gradient terminus for
  `button-primary` and the hover-state ground.
- **`secondary` (#B85C2F):** Burnt sienna. The amber's natural gradient
  partner. Use for `gradient-text` and `gradient-text-warm` second stops.
- **`tertiary` (#D9523E):** Terracotta. The **ember** tone — higher-urgency
  action ("Book Evaluation," "Request a Lesson"). Distinct from primary
  amber so the visual hierarchy reads as "soft action vs. hot action."
- **`accent-sage` (#A5C49C):** The only cool note in the palette. Scoped
  strictly to **EASE moments** — EASE badges, success states, milestone
  callouts. Don't put sage on chrome.
- **`accent-amber-light` (#F2C078):** Used only as the third stop in
  `gradient-text-warm`. Not for solid fills.
- **`on-background` (#F4ECE0):** Cream. Body text. Never pure white.
- **`on-background-muted` (#A89F8E):** Taupe. Captions, metadata.

**Color rules:**
- **Sage is for EASE.** If a surface isn't about EASE, success, or milestone
  language, it doesn't use sage. The brand's warmth is the rule; sage is the
  exception that makes the rule readable.
- **Two CTA ladders, not three.** Amber = soft action ("Read the Post,"
  "View the Pathway"). Ember (terracotta) = hot action ("Book Evaluation,"
  "Schedule a Lesson"). Outline = tertiary nav.
- **Sanctioned gradients:** `primary → primary-deep` (`E8A03A → C77327`) for
  amber buttons, `primary → secondary` (`E8A03A → B85C2F`) for text /
  hero gradients, `tertiary → secondary` (`D9523E → B85C2F`) for ember
  buttons, and `accent-amber-light → primary → secondary` for warm gradient
  text only. No multi-color rainbow gradients outside these.
- **Glassmorphism is on-brand here.** Unlike NGA and L&D, this site uses
  glass-card surfaces (`backdrop-filter: blur(14px)` over a low-alpha cream
  tint) as a deliberate aesthetic choice — the soft, lifted, refractive
  feel matches the premium-warm direction. Use it sparingly; not every card
  needs to glass.
- Pure white (`#fff`) and pure black (`#000`) are banned. Always cream and
  warm charcoal.

## Typography

Three families. Same stack as NGA — parents who arrive via NGA see family
resemblance, but the palette and tone tell them this is the personal
practice.

| Role | Family | Use |
|------|--------|-----|
| Headings, CTAs, hero | **Montserrat** (700/800) | All `h1`–`h4`, button labels, hero |
| Body, prose, forms | **Inter** (400/500/600) | Paragraphs, descriptions, forms |
| Prices, stats, dates, eyebrows | **Roboto Mono** (400/700) | Pricing, DUPR ratings, eyebrow labels above headlines |

- The `price` scale exists because pricing is load-bearing on this site —
  the `PRICING` constant in `src/lib/coaching.ts` is the single source of
  truth, and prices render large and mono so a parent reads them without
  squinting.
- The `eyebrow` scale (mono, 0.18em tracking, amber color) sits above hero
  headlines as a category label. Always use the mono face — distinguishing
  the eyebrow from the headline by family, not just size.

## Layout & Spacing

Mobile-first. 4px base unit (`spacing.s-4` = 16px).

- Tap targets: 48×48px minimum.
- Strong typographic hierarchy: eyebrow → big headline → body → single CTA.
- Generous whitespace — the brand reads as "considered," not "crammed."
- Photo-forward hero patterns: full-bleed photo with warm gradient overlay
  for legibility (the `.hero-full-bleed` pattern in `globals.css`).

## Elevation & Depth

Depth is achieved through a combination of warm surface layering, subtle
glow borders, and (on glass cards) backdrop blur. Cocoa surfaces stacked
with low-amber glow borders read as lit-from-within, which is the desired
"premium warm charcoal" feel.

- **Level 0 — `background`:** the page ground (deep warm charcoal).
- **Level 1 — `surface`:** primary cards (cocoa).
- **Level 2 — `surface-warm` / glass:** featured offers, glass-cards.
- **Sanctioned shadows:** soft, dark, large-spread
  (`0 16px 48px rgba(0, 0, 0, 0.45)`) for cards;
  warm amber-tinted glow for hover and featured states
  (`0 0 24px rgba(232, 160, 58, 0.10)`).
- **Sanctioned page-level effects:** the subtle film-grain warmth
  (low-opacity radial amber + sienna gradients fixed across the viewport)
  and the photo-spotlight radial behind hero subjects. Both reinforce the
  warm-premium aesthetic; both are scoped to the page level, not stacked
  on individual components.

## Shapes

Larger radii than NGA (1rem default cards vs. 12px). The softer corners
match the warm aesthetic.

- `rounded.sm` (4px) — chips, tight inline
- `rounded.md` (8px) — buttons, inputs
- `rounded.lg` (1rem / 16px) — cards (default)
- `rounded.xl` (1.25rem / 20px) — hero containers, featured cards
- `rounded.full` — badges, pills, avatars

## Components

- `card-warm` is the standard coaching offer tile (Single Lesson, 4-Pack,
  Three-Plus-One Group). Background gradient `surface-warm → surface`;
  amber-tinted border at 16% opacity.
- `card-warm-featured` lifts the recommended package to the cocoa surface
  for visual primacy.
- `card-blog` is the blog index card on `/blog`.
- `card-credential` is a small tile for credential badges (RPO, PPR Pro,
  DUPR Coach, M.S. Coaching).
- `badge-ease` uses sage + cocoa — the **only** place sage appears as an
  interactive element.
- `badge-credential` uses amber + cocoa for coaching credentials.
- `tag-pill` (blog tags) uses cocoa ground + amber text, amber border at
  22% opacity.

### Buttons

- `button-primary` is the soft amber action ("Read the Post," "View the
  Pathway"). Amber ground, cocoa text. Hover deepens to `primary-deep`.
- `button-ember` is the hot terracotta action ("Book Evaluation," "Schedule
  a Lesson," "Request a Pricing Estimate"). Terracotta ground, cocoa text.
  Use sparingly — every ember button is a moment that earns the visual heat.
- `button-outline` is the lowest hierarchy (secondary nav, "back to all
  posts"). Cream border at 22% opacity, no fill until hover.

### Partner-link rule

Where copy or components link to gear or court booking, the partner is
locked:

- **Paddle / gear** → JOOLA only (Pike & Rose flagship + joola.com). No
  other paddle brand appears by name on this site.
- **Court booking** → ActiveMontgomery (activemontgomery.org).

These rules are content-level, not token-level, but design shouldn't
introduce affordances (logo strips, "shop our partners" rails) that imply a
broader set of brands than the two above.

## Do's and Don'ts

### Do
- Use Roboto Mono for every price, DUPR rating, date, and numeric fact.
  Numbers are part of the trust signal.
- Pull pricing from `PRICING` in `src/lib/coaching.ts` — never hard-code
  dollar amounts in copy, JSON-LD, or email templates.
- Lead with the next concrete action (Book, Schedule, Reply). Coach speaks
  plainly.
- Use real coaching photography. Mixed ages, families, candid action.
  Apply the `hero-image-warm` filter
  (`saturate(0.9) brightness(0.85) contrast(1.05)`) to match the
  warm-premium tone.

### Don't
- Don't put sage anywhere except EASE / success contexts. Sage is the
  exception, not a chrome color.
- Don't introduce a third paddle brand. JOOLA exclusively.
- Don't reference Dill Dinkers (DD), CourtReserve (CR), or the legacy Hub.
  The site was decoupled 2026-05-02.
- Don't reference mocopb.com — retired 2026-05-19.
- Don't render service-area copy implying travel outside the 35-min radius
  from Olney, MD (`SERVICE_AREA` in `src/lib/constants.ts`).
- Don't substitute navy for warm charcoal. The warm undertone distinguishes
  this brand from NGA. If a surface reads cool, it's wrong.
- Don't use pure white (`#fff`) or pure black (`#000`) — always cream
  (`#F4ECE0`) and warm charcoal (`#0F0E0C`).
- Don't use generic SaaS CTAs ("Get Started," "Learn More," "Submit").
  Coach voice is specific: "Book a Lesson," "Request an Evaluation,"
  "Read the Post."
- Don't use multi-color or rainbow gradients. The four sanctioned gradient
  pairings (above) are the entire vocabulary.
