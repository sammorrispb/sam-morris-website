# Graph Report - sam-morris-website  (2026-09-22)

## Corpus Check
- 115 files · ~987,004 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: .css 2, .example 1, (none) 1)

## Summary
- 716 nodes · 1192 edges · 47 communities (35 shown, 12 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b7b7f49f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- constants.ts
- Sam Morris — Personal Brand Guide
- trackEvent
- drip.ts
- vitest
- emailTemplates.ts
- @notionhq/client
- stripe-webhook.test.ts
- actions.ts
- [slug]/page.tsx
- pickl-park/page.tsx
- generate-search-index.ts
- coaching/page.tsx
- coaching-progress.js
- compilerOptions
- package.json
- log-lesson.js
- AdminDashboard
- devDependencies
- dependencies
- scripts
- public-pages.spec.ts
- vercel.json
- eslint.config.mjs
- context7
- postcss.config.mjs
- CLAUDE.md
- next
- SearchBar.tsx
- DESIGN.md
- Nav Search Bar — Design
- webhook/route.ts
- api/leads/route.ts
- leads.test.ts
- coaching-crm.ts
- README.md
- 2026-02-27-sam-morris-website-design.md
- 2026-02-27-sam-morris-website-implementation.md

## God Nodes (most connected - your core abstractions)
1. `next` - 38 edges
2. `trackEvent()` - 27 edges
3. `react` - 19 edges
4. `breadcrumbJsonLd()` - 18 edges
5. `vitest` - 17 edges
6. `compilerOptions` - 16 edges
7. `coachRequestUrl()` - 15 edges
8. `@notionhq/client` - 14 edges
9. `submitCohortSignup()` - 12 edges
10. `notifySam()` - 12 edges

## Surprising Connections (you probably didn't know these)
- `The free evaluation is retired (2026-08-24)` --references--> `coachRequestUrl()`  [INFERRED]
  CLAUDE.md → src/lib/urls.ts
- `P0 — Foundation Sweep` --references--> `Footer()`  [INFERRED]
  seo-backlog.md → src/components/Footer.tsx
- `P0 — Foundation Sweep` --references--> `Nav()`  [INFERRED]
  seo-backlog.md → src/components/Nav.tsx
- `P1 — Content Expansion (`/lessons/[city]` — 8 routes)` --references--> `generateStaticParams()`  [INFERRED]
  seo-backlog.md → src/app/blog/[slug]/page.tsx
- `P0 — Foundation Sweep` --references--> `generateMetadata()`  [INFERRED]
  seo-backlog.md → src/app/blog/[slug]/page.tsx

## Import Cycles
- None detected.

## Communities (47 total, 12 thin omitted)

### Community 0 - "constants.ts"
Cohesion: 0.07
Nodes (46): react, ContactPage(), metadata, Home(), metadata, PATHS, TEL, EVENT_HIGHLIGHTS (+38 more)

### Community 1 - "Sam Morris — Personal Brand Guide"
Cohesion: 0.06
Nodes (30): About Me — Full Bio, Blog Topics (by Pillar), Brand Identity Overview, Brand Voice Guide, Coaching and Strategy, Coaching Philosophy, Color Palette (Site Implementation), Content Pillars (+22 more)

### Community 2 - "trackEvent"
Cohesion: 0.10
Nodes (30): LeadForm(), handleSubmit(), updateField(), PageViewTracker(), shouldSkip(), SKIP_PREFIXES, QuizClient(), handleStart() (+22 more)

### Community 3 - "drip.ts"
Cohesion: 0.09
Nodes (22): ref_crypto, dynamic, GET(), dynamic, GET(), htmlResponse(), DRIP_MAX_AGE_DAYS, DRIP_SCHEDULE (+14 more)

### Community 4 - "vitest"
Cohesion: 0.07
Nodes (22): cheerio, ref_node_child_process, ref_node_fs, ref_node_path, ref_node_url, vitest, POST(), POST() (+14 more)

### Community 5 - "emailTemplates.ts"
Cohesion: 0.14
Nodes (8): COACHING_INTERESTS, DripCta, dripRequestUrl(), interestSlug(), privateLessonTemplate(), SIGN_OFF, TEMPLATE_MAP, youthTemplate()

### Community 6 - "@notionhq/client"
Cohesion: 0.08
Nodes (25): @notionhq/client, daysBack, getClients(), getExistingLessons(), main(), notion, CLIENTS_DB_ID, DEFAULT_SKILLS (+17 more)

### Community 7 - "stripe-webhook.test.ts"
Cohesion: 0.17
Nodes (9): constructEventMock, createCoachingClientMock, generateEmailDraftMock, notifySamMock, notionDataSourcesQuery, notionPagesCreate, sendEmailMock, Stripe (+1 more)

### Community 8 - "actions.ts"
Cohesion: 0.11
Nodes (27): @supabase/supabase-js, createCohortLead(), getNotion(), submitCohortSignup(), metadata, CohortSignupPage(), handleSubmit(), CohortSignupInput (+19 more)

### Community 9 - "[slug]/page.tsx"
Cohesion: 0.06
Nodes (42): Done log (auto-pruned at 30 days), Hard rules for any work on this repo, P0 — Foundation Sweep, P1 — Content Expansion (`/lessons/[city]` — 8 routes), P2 — AEO Depth (`/learn` hub), SEO/AEO Backlog — sammorrispb.com, Status legend, Task fields (+34 more)

### Community 10 - "pickl-park/page.tsx"
Cohesion: 0.16
Nodes (17): BREADCRUMBS, FAQS, metadata, PicklParkPage(), revalidate, classAboutText(), PICKL_PARK_CLASSES, picklParkClass (+9 more)

### Community 11 - "generate-search-index.ts"
Cohesion: 0.11
Nodes (20): ref_fs, gray-matter, ref_path, ref_url, APP_DIR, BLOG_DIR, blogEntries, __dirname (+12 more)

### Community 12 - "coaching/page.tsx"
Cohesion: 0.09
Nodes (24): @vercel/analytics, @vercel/speed-insights, src_app_globals, inter, metadata, montserrat, robotoMono, RootLayout() (+16 more)

### Community 13 - "coaching-progress.js"
Cohesion: 0.22
Nodes (18): CATEGORY_ORDER, CLIENTS_DB_ID, dateVal(), LESSONS_DB_ID, LEVEL_ICONS, listAllClients(), main(), multiSelectNames() (+10 more)

### Community 14 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 15 - "package.json"
Cohesion: 0.12
Nodes (16): name, private, version, next-mdx-remote, react-dom, reading-time, stripe, tailwindcss (+8 more)

### Community 16 - "log-lesson.js"
Cohesion: 0.12
Nodes (16): args, CLIENTS_DB_ID, dateStr, duration, findClient(), focusRaw, hours, LESSONS_DB_ID (+8 more)

### Community 17 - "AdminDashboard"
Cohesion: 0.13
Nodes (8): metadata, AdminDashboard(), Lead, LeadsData, needsAttention(), SOURCE_OPTIONS, STATUS_OPTIONS, statusClasses()

### Community 18 - "devDependencies"
Cohesion: 0.13
Nodes (15): devDependencies, cheerio, eslint, eslint-config-next, @playwright/test, tailwindcss, @tailwindcss/postcss, @tailwindcss/typography (+7 more)

### Community 19 - "dependencies"
Cohesion: 0.14
Nodes (14): dependencies, fuse.js, gray-matter, next, next-mdx-remote, nodemailer, @notionhq/client, react (+6 more)

### Community 20 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, build, dev, lint, search-index, start, test, test:all (+2 more)

### Community 21 - "public-pages.spec.ts"
Cohesion: 0.29
Nodes (4): BANNED_VISIBLE, PUBLIC_ROUTES, PORT, @playwright/test

### Community 22 - "vercel.json"
Cohesion: 0.40
Nodes (4): crons, headers, redirects, rewrites

### Community 23 - "eslint.config.mjs"
Cohesion: 0.50
Nodes (3): eslintConfig, eslint, eslint-config-next

### Community 24 - "context7"
Cohesion: 0.50
Nodes (3): npx, context7, @upstash/context7-mcp

### Community 29 - "CLAUDE.md"
Cohesion: 0.11
Nodes (17): Architecture, Commands, Cursor / Copilot rules, Date Handling, Deployment Verification, Git Safety, No Dill Dinkers / CourtReserve / Hub references, Notion / Supabase / Stripe env vars (+9 more)

### Community 30 - "next"
Cohesion: 0.12
Nodes (8): nextConfig, next, metadata, runtime, MobileCTA(), BRAND_MAP, PROGRAM_NAV, ProgramsNav()

### Community 31 - "SearchBar.tsx"
Cohesion: 0.14
Nodes (12): Nav Search Bar Implementation Plan, Task 1: Install Fuse.js and add search-index script, Task 2: Create the search index generator, Task 3: Create the SearchBar component, Task 4: Integrate SearchBar into Nav, Task 5: Polish and edge cases, fuse.js, SearchBar() (+4 more)

### Community 32 - "DESIGN.md"
Cohesion: 0.15
Nodes (12): Buttons, Colors, Components, Do, Do's and Don'ts, Don't, Elevation & Depth, Layout & Spacing (+4 more)

### Community 33 - "Nav Search Bar — Design"
Cohesion: 0.15
Nodes (12): Decisions, Fuse.js Config, Index Loading, Nav Search Bar — Design, Nav.tsx Integration, New Files, No API Routes, Package Changes (+4 more)

### Community 34 - "webhook/route.ts"
Cohesion: 0.27
Nodes (10): nodemailer, dynamic, getStripe(), hasDuplicatePaidLead(), mapProduct(), POST(), EmailResult, getTransporter() (+2 more)

### Community 35 - "api/leads/route.ts"
Cohesion: 0.31
Nodes (9): attributedSource(), createEmailDraft(), LeadUtm, POST(), sanitizeNotes(), generateEmailDraft(), ingestToOpenBrain(), OpenBrainBusiness (+1 more)

### Community 36 - "leads.test.ts"
Cohesion: 0.25
Nodes (6): generateEmailDraftMock, ingestToOpenBrainMock, notifySamMock, notionPagesCreate, notionPagesUpdate, sendEmailMock

### Community 37 - "coaching-crm.ts"
Cohesion: 0.33
Nodes (6): createCoachingClient(), CreateCoachingClientOptions, CreateCoachingClientResult, DEFAULT_SKILLS, hasExistingClient(), SkippedResult

### Community 38 - "README.md"
Cohesion: 0.40
Nodes (4): Analytics, Deploy on Vercel, Getting Started, Learn More

## Knowledge Gaps
- **319 isolated node(s):** `npx`, `@upstash/context7-mcp`, `PUBLIC_ROUTES`, `BANNED_VISIBLE`, `eslintConfig` (+314 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 392 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `constants.ts`, `webhook/route.ts`, `drip.ts`, `vitest`, `api/leads/route.ts`, `@notionhq/client`, `trackEvent`, `actions.ts`, `[slug]/page.tsx`, `pickl-park/page.tsx`, `coaching/page.tsx`, `package.json`, `AdminDashboard`, `SearchBar.tsx`?**
  _High betweenness centrality (0.304) - this node is a cross-community bridge._
- **Why does `@notionhq/client` connect `@notionhq/client` to `webhook/route.ts`, `api/leads/route.ts`, `drip.ts`, `coaching-crm.ts`, `actions.ts`, `[slug]/page.tsx`, `coaching-progress.js`, `package.json`, `log-lesson.js`?**
  _High betweenness centrality (0.158) - this node is a cross-community bridge._
- **Why does `vitest` connect `vitest` to `constants.ts`, `trackEvent`, `drip.ts`, `leads.test.ts`, `@notionhq/client`, `stripe-webhook.test.ts`, `pickl-park/page.tsx`, `coaching/page.tsx`, `package.json`?**
  _High betweenness centrality (0.092) - this node is a cross-community bridge._
- **What connects `npx`, `@upstash/context7-mcp`, `PUBLIC_ROUTES` to the rest of the system?**
  _319 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `constants.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07244843997884717 - nodes in this community are weakly interconnected._
- **Should `Sam Morris — Personal Brand Guide` be split into smaller, more focused modules?**
  _Cohesion score 0.06451612903225806 - nodes in this community are weakly interconnected._
- **Should `trackEvent` be split into smaller, more focused modules?**
  _Cohesion score 0.10128205128205128 - nodes in this community are weakly interconnected._