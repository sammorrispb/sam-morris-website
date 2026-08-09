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

### Pricing lives in Coach OS, not on this site
`src/lib/coaching.ts` no longer exists — pricing and booking moved to Coach OS (`COACH_BOOKING_URL` / `COACH_REQUEST_URL` in `src/lib/constants.ts`; Coach OS handles quoting and invoicing). There are **zero dollar amounts anywhere in `src/`** and `tests/brand/brand-copy.test.ts` enforces the `$` ban. Never hard-code prices in pages, emails, structured data, or blog copy.

### Service area is locked at 35-min radius from Olney, MD (one sanctioned exception)
`SERVICE_AREA` in `src/lib/constants.ts` is the canonical description. The travel radius is locked at ~35 min from Olney, MD, with one sanctioned exception (Sam-approved 2026-08-09): **private lessons at The Pickle Park in Frederick, MD** — a partner/host venue (`FREDERICK_VENUE` in constants.ts), not a competitor. Frederick applies to private lessons (and evals) only — don't extend it to group/3+1/events copy or to `SERVICE_AREA.shortDescription`, don't add other out-of-radius venues, and don't list competitor venues by name.

### Partner-link rules (blog, programs, anywhere user-facing)
- **JOOLA** is the default paddle/gear link (Pike & Rose flagship + joola.com). It is the only paddle brand allowed in copy.
- **ActiveMontgomery** (activemontgomery.org) is the default link for MoCo court booking.
- Do **NOT** mention other paddle brands by name (no Selkirk, Joola is exclusive on this site even though it is not a formal sponsor of NGA).

### No Dill Dinkers / CourtReserve / Hub references
This site was decoupled from DD/CR/The Hub on 2026-05-02 after Sam's 2026-05-01 termination. Do not re-introduce links, copy, embeds, iframes, or programs referencing dilldinkers.com, DD's Rockville/North Bethesda facilities, or any CR-hosted page. The legacy DD-coupled Hub (archived `Link-Dink` repo, formerly `The-Hub`) is dead — do not extend it.

**Note:** `linkanddink.com` itself is no longer the Hub. As of 2026-05-18 the domain has been repurposed onto a fresh, non-archived `link-and-dink` repo (community-os umbrella; newsletter + pop-up tournaments). It is a valid Sam-owned sibling site — `Organization.sameAs` lists it alongside NGA, and family-nav links to `linkanddink.com` are fine. The prohibition above refers strictly to the archived Hub, not the current domain.

**`mocopb.com` is retired (2026-05-19).** Soft-410'd via `sammorrispb/mocopb#47`. Do NOT add `mocopb.com` to `sameAs` graphs, family-nav, or copy on this site. Existing references have been removed.

Analytics now flows to Open Brain via `/api/analytics`; if you find any remaining Hub-coupled code, remove it rather than extending it.

### Notion / Supabase / Stripe env vars
`NOTION_API_KEY` + `NOTION_BLOG_DB_ID` for blog, `SUPABASE_*` for lead storage / admin, `STRIPE_*` for webhook receipts only, `OPEN_BRAIN_ANALYTICS_URL` + `LEAD_INGEST_TOKEN` for analytics. See `.env.example`. Watch for trailing newlines on copied keys (global rule).

### `vercel.json` already owns redirects and crons
Before adding `redirect()` calls in route handlers, check `vercel.json` — there's a long redirect block and a cron schedule. Edge headers (`X-Frame-Options: DENY`, etc.) are also set there, not in middleware.

## Cursor / Copilot rules
None present (`.cursor*` and `.github/copilot-instructions.md` do not exist). This file is the only IDE/AI guide.

## README highlights
The root `README.md` is mostly the create-next-app boilerplate, but its **"Unified funnel ingest"** section documents the Hub analytics pipeline and the required `FUNNEL_INGEST_SECRET_SAMMORRISPB` env var. That section is the authoritative reference for any analytics work — keep it in sync if you change the funnel client/server.


## Git Safety
- Never run `git reset --hard` without first checking for uncommitted work in parallel sessions/worktrees
- Prefer `git stash` or branch-based recovery

## Date Handling
- Never use `new Date(y, m, d)` for date-only values — it breaks on UTC build servers
- Use ISO date strings or date-fns with explicit timezone handling

## Deployment Verification
- After merging any PR, verify the change is live in production via curl/browser before declaring done
- For migrations, confirm schema applied in prod Supabase
- For cron jobs, smoke-test the endpoint

## Session End Protocol
- Always save learnings to Open Brain (OB) at session end via MCP, with SQL fallback if MCP transport is unhealthy
- Persist key decisions, friction points, and resolved bugs as searchable thoughts
