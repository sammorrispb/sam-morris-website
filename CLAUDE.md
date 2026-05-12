# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is
Sam Morris's personal coaching site at **sammorrispb.com** — Next.js 16 (App Router) + TypeScript + Tailwind v4. Hosts coaching offers, blog, evaluation funnel, contact form, and admin dashboard. Independent coaching launched 2026-05-04; this is the public face for that practice.

## Commands
- `npm run dev` — Next dev server on :3000.
- `npm run build` — regenerates the static blog/page search index via `scripts/generate-search-index.ts`, then `next build`. The prebuild script runs every time, so build failures often surface there first.
- `npm run lint` — flat-config ESLint (`eslint.config.mjs`, extends `eslint-config-next`).
- `npm run search-index` — regenerate `public/search-index.json` standalone.
- No `test` or `typecheck` script — type errors only surface during `next build` (strict mode).

## Architecture
**App Router layout** in `src/app/`: public marketing pages (`/`, `/about`, `/programs`, `/programs/coaching`, `/programs/events`, `/evaluation`, `/quiz`, `/blog`, `/blog/[slug]`, `/contact`), plus an `/admin` dashboard. `/tournament/*` is rewritten through to `tournamentwebsite.vercel.app` (see `vercel.json`). Many legacy `/locations/*`, `/playdate/*`, and old program slugs are 301'd to current pages — check `vercel.json` before adding new routes that might collide.

**Blog/MDX system** is Notion-backed via `@notionhq/client`. `src/lib/blog.ts` pulls Published rows from `NOTION_BLOG_DB_ID`, renders blocks server-side, and `next-mdx-remote` handles inline MDX. Posts gracefully degrade to empty list if env is missing — don't add throws there.

**Lead / booking flow**: `/contact` and `/evaluation` submit to `src/app/api/leads/route.ts` and `src/app/api/eval-book/route.ts`, which write to Supabase (`@supabase/supabase-js`, admin features only) and send email via Nodemailer (`src/lib/email.ts`, `src/lib/emailTemplates.ts`). Paid lessons use **Stripe Payment Links** (external checkout) — there is no Stripe SDK flow on this site. The Stripe webhook at `src/app/api/stripe/webhook` exists for receipt logging only. A daily Vercel cron at `/api/cron/follow-up` (12:00 UTC, see `vercel.json`) drives lead follow-up email sequences.

**Analytics**: outbound CTA clicks, lead submits, scroll depth, and quiz events are forwarded to the Open Brain analytics-ingest edge function via the same-origin `/api/analytics` proxy. See `src/lib/funnelClient.ts` (browser → `/api/analytics`) and `src/app/api/analytics/route.ts` (server → OB, token-authed with `LEAD_INGEST_TOKEN` + `OPEN_BRAIN_ANALYTICS_URL`). `src/lib/urls.ts` stamps `?ref=sammorrispb` / `utm_source=sammorrispb` on cross-site family links. Fire-and-forget; analytics failures never block the page. Don't re-add Hub funnel calls.

**Deployment**: Vercel, auto-deploy on push to `main`. Repo: `github.com/sammorrispb/sam-morris-website`.

## Repo-specific gotchas

### Pricing is single-sourced in `src/lib/coaching.ts`
The `PRICING` constant (`singleHourly: 130`, `fourPackTotal: 400`, `fourPackHourly: 100`, `groupPerPersonHourly: 50`, `threePlusOneTotal: 150`) **is the only source of truth** for coaching prices across the site, email templates, and JSON-LD. Never hard-code dollar amounts in `/programs/coaching`, emails, structured data, or blog copy. Stripe Payment Link constants (`SINGLE_LESSON_LINK`, `FOUR_PACK_LINK`, `THREE_PLUS_ONE_LINK`) and the Google Calendar `BOOKING_URL` also live here — edit there, not inline.

### Service area is locked at 35-min radius from Olney, MD
`SERVICE_AREA` in `src/lib/constants.ts` is the canonical description. Don't introduce new copy about Sam traveling to facilities outside that radius or list specific competitor venues by name.

### Partner-link rules (blog, programs, anywhere user-facing)
- **JOOLA** is the default paddle/gear link (Pike & Rose flagship + joola.com). It is the only paddle brand allowed in copy.
- **ActiveMontgomery** (activemontgomery.org) is the default link for MoCo court booking.
- Do **NOT** mention other paddle brands by name (no Selkirk, Joola is exclusive on this site even though it is not a formal sponsor of NGA).

### No Dill Dinkers / CourtReserve / Hub references
This site was decoupled from DD/CR/The Hub on 2026-05-02 after Sam's 2026-05-01 termination. Do not re-introduce links, copy, embeds, iframes, or programs referencing dilldinkers.com, DD's Rockville/North Bethesda facilities, or any CR-hosted page. The Hub's `linkanddink.com` DNS is offline. Analytics now flows to Open Brain via `/api/analytics`; if you find any remaining Hub-coupled code, remove it rather than extending it.

### Notion / Supabase / Stripe env vars
`NOTION_API_KEY` + `NOTION_BLOG_DB_ID` for blog, `SUPABASE_*` for lead storage / admin, `STRIPE_*` for webhook receipts only, `OPEN_BRAIN_ANALYTICS_URL` + `LEAD_INGEST_TOKEN` for analytics. See `.env.example`. Watch for trailing newlines on copied keys (global rule).

### `vercel.json` already owns redirects and crons
Before adding `redirect()` calls in route handlers, check `vercel.json` — there's a long redirect block and a cron schedule. Edge headers (`X-Frame-Options: DENY`, etc.) are also set there, not in middleware.

## Cursor / Copilot rules
None present (`.cursor*` and `.github/copilot-instructions.md` do not exist). This file is the only IDE/AI guide.

## README highlights
The root `README.md` is mostly the create-next-app boilerplate, but its **"Unified funnel ingest"** section documents the Hub analytics pipeline and the required `FUNNEL_INGEST_SECRET_SAMMORRISPB` env var. That section is the authoritative reference for any analytics work — keep it in sync if you change the funnel client/server.
