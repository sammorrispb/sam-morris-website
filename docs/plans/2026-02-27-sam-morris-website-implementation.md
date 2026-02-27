# Sam Morris Personal Website — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a 5-page personal brand website for Sam Morris — lead gen landing page, about, programs, blog (MDX), and contact — with Notion-backed lead form.

**Architecture:** Next.js 15 App Router with Tailwind CSS. Static pages with one API route (`/api/leads`) that writes to Notion and sends email notification. Blog powered by MDX files in `/content/blog/`. Dark electric theme throughout.

**Tech Stack:** Next.js 15, Tailwind CSS, MDX (via @next/mdx + gray-matter + next-mdx-remote), Notion API (@notionhq/client), Vercel Analytics, next/font/google (Montserrat, Inter, Roboto Mono).

**Reference docs:**
- Design: `docs/plans/2026-02-27-sam-morris-website-design.md`
- Brand guide: `docs/brand-guide.md`

---

## Task 1: Scaffold Next.js Project

**Files:**
- Create: `package.json`, `next.config.mjs`, `tailwind.config.ts`, `tsconfig.json`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`, `.gitignore`, `.env.local`

**Step 1: Create Next.js app with Tailwind**

Run from `/home/passwd/sam-morris-website`:
```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-turbopack
```
Expected: Scaffolded Next.js project in current directory. Select defaults when prompted.

**Step 2: Install additional dependencies**

```bash
npm install @notionhq/client gray-matter next-mdx-remote reading-time @vercel/analytics
npm install -D @tailwindcss/typography
```

**Step 3: Create `.env.local`**

```
NOTION_API_KEY=your_notion_api_key_here
NOTION_LEADS_DB_ID=your_database_id_here
CONTACT_EMAIL=sam.morris2131@gmail.com
```

**Step 4: Verify dev server starts**

```bash
npm run dev
```
Expected: Server runs on localhost:3000, default Next.js page renders.

**Step 5: Commit**

```bash
git add -A && git commit -m "chore: scaffold Next.js project with Tailwind and dependencies"
```

---

## Task 2: Design System — Tailwind Config, Fonts, Global Styles

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`

**Step 1: Configure Tailwind with brand colors and fonts**

Replace `tailwind.config.ts`:
```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: "#0a0e27", light: "#141937" },
        accent: {
          blue: "#3b82f6",
          purple: "#8b5cf6",
          pink: "#ec4899",
          lime: "#a3e635",
        },
        text: { primary: "#f0f0f5", muted: "#94a3b8" },
      },
      fontFamily: {
        heading: ["var(--font-montserrat)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-roboto-mono)", "monospace"],
      },
      backgroundImage: {
        "gradient-hero": "linear-gradient(135deg, #3b82f6, #8b5cf6)",
        "gradient-navy": "linear-gradient(180deg, #0a0e27, #141937)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
```

**Step 2: Set up fonts in layout.tsx**

Replace `src/app/layout.tsx` with Montserrat, Inter, Roboto_Mono from `next/font/google`. Set CSS variables. Add `@vercel/analytics`. Set body classes: `bg-navy text-text-primary font-body antialiased`.

Root metadata:
- title template: `"%s | Sam Morris"`, default: `"Sam Morris — Coach. Builder. Dad."`
- description: brand positioning statement

**Step 3: Set up global CSS**

Replace `src/app/globals.css` with Tailwind directives plus:
- Smooth scroll, selection color
- `.glow-border` utility (1px solid rgba blue, box-shadow)
- `.glow-border-hover` utility (brighter on hover)
- `.gradient-text` utility (blue-to-purple gradient text)
- `fadeUp` and `fadeIn` keyframe animations

**Step 4: Verify fonts and colors render**

Temp test page with heading (Montserrat), body (Inter), stat (Roboto Mono), gradient text. Run dev server and confirm.

**Step 5: Commit**

```bash
git add -A && git commit -m "feat: configure design system — colors, fonts, global styles"
```

---

## Task 3: Shared Components — Nav and Footer

**Files:**
- Create: `src/components/Nav.tsx`
- Create: `src/components/Footer.tsx`
- Create: `src/lib/constants.ts`
- Modify: `src/app/layout.tsx`

**Step 1: Create constants file**

`src/lib/constants.ts` — exports:
- `NAV_LINKS`: About, Programs, Blog, Contact
- `SOCIAL_LINKS`: Instagram, Facebook, LinkedIn, TikTok, YouTube (href="#" placeholder)
- `CONTACT`: email + phone
- `INTEREST_OPTIONS`: Open Play, Coaching / Private Lessons, Next Gen Academy, Group Programs, Corporate Events, Just Curious

**Step 2: Create Nav component**

`src/components/Nav.tsx` — "use client" component:
- Fixed top, glass blur background (`bg-navy/80 backdrop-blur-md`)
- Left: "Sam Morris" text logo linking to `/`
- Right desktop: nav links + gradient "Book a Free Evaluation" CTA button
- Mobile: hamburger toggle, slide-down menu
- Links from constants

**Step 3: Create Footer component**

`src/components/Footer.tsx` — server component:
- 3-column grid: Brand blurb | Page links | Contact + Social
- Social links highlight pink on hover
- Copyright with dynamic year

**Step 4: Wire into layout.tsx**

Import Nav + Footer, wrap children: `<Nav />` then `<main className="pt-16">{children}</main>` then `<Footer />`

**Step 5: Verify nav + footer render, mobile menu toggles**

**Step 6: Commit**

```bash
git add -A && git commit -m "feat: add Nav and Footer with mobile menu"
```

---

## Task 4: Lead Form Component

**Files:**
- Create: `src/components/LeadForm.tsx`

**Step 1: Create the shared lead form**

`src/components/LeadForm.tsx` — "use client" component:
- Props: `heading?: string` (default "Ready to Play?")
- State: `form` (name, email, interest), `status` (idle/sending/sent/error)
- On submit: POST to `/api/leads`, handle success/error
- Sent state: checkmark + "You're in!" message
- Error state: pink error text with fallback email
- Inputs: dark bg, border glow on focus, placeholder text
- Select: interest dropdown from INTEREST_OPTIONS constant
- Submit button: gradient background, disabled while sending

**Step 2: Commit**

```bash
git add -A && git commit -m "feat: add reusable LeadForm component"
```

---

## Task 5: Homepage — All Sections

**Files:**
- Modify: `src/app/page.tsx`

**Step 1: Build the full homepage with these sections**

1. **Hero** — gradient navy bg, radial blue glow, headline "Better than yesterday — together." with gradient text on "together", subhead, two CTA buttons (gradient + outline)

2. **Social Proof Bar** — navy-light bg, flex row of 5 stats: "20+" / "2" / "500+" / "M.S." / "Gold" with labels. Font-mono for values, accent-blue color.

3. **EASE Framework** — 4 cards in grid. Each: lime green oversized letter, bold title, muted description. Glow borders.

4. **Programs Preview** — 3 cards: Next Gen Academy, Private Lessons, Link & Dink. Each: title, description, CTA link. Link & Dink uses external `<a>` tag.

5. **Lead Form** — imports and renders `<LeadForm />`

6. **Blog Placeholder** — heading + "Read All Posts" link (wired to real posts in Task 14)

**Step 2: Verify all sections render**

**Step 3: Commit**

```bash
git add -A && git commit -m "feat: build homepage with hero, EASE, programs, lead form"
```

---

## Task 6: About Page

**Files:**
- Create: `src/app/about/page.tsx`

**Step 1: Build the About page**

Sections:
1. **Hero** — "About Sam" heading, positioning statement
2. **Timeline** — Vertical timeline with glowing dot connectors. 9 milestones from brand guide bio (Hong Kong adoption through current ventures). Each: year, title, description. Alternating glow colors.
3. **Coaching Philosophy** — Styled blockquote with accent border
4. **Photo placeholder** — Gray rounded box with "Photo coming soon" text

Export metadata: `title: "About"`

**Step 2: Verify at /about**

**Step 3: Commit**

```bash
git add -A && git commit -m "feat: add About page with timeline and coaching philosophy"
```

---

## Task 7: Programs Page

**Files:**
- Create: `src/app/programs/page.tsx`

**Step 1: Build the Programs page**

Sections:
1. **Hero** — "Programs & Services" heading
2. **Next Gen Academy** (id="academy") — 4 color-coded level cards: Red (#ef4444), Orange (#f97316), Green (#22c55e), Yellow (#eab308). Each: colored left border, level name, skill description. "Free 30-min evaluation" callout. Link to nexgenpbacademy.com.
3. **Private Lessons** — description + CTA to /contact
4. **Link & Dink** — description + external link to linkanddink.com
5. No pricing anywhere

Export metadata: `title: "Programs"`

**Step 2: Verify at /programs, check #academy anchor**

**Step 3: Commit**

```bash
git add -A && git commit -m "feat: add Programs page with academy levels and services"
```

---

## Task 8: Blog Infrastructure — MDX Setup

**Files:**
- Create: `src/lib/blog.ts`
- Create: `content/blog/the-shot-development-hierarchy.mdx`
- Create: `content/blog/community-is-the-moat.mdx`

**Step 1: Create blog utility**

`src/lib/blog.ts` exports:
- `BlogPost` type: slug, title, excerpt, category, date, readingTime, content
- `getAllPosts()`: reads `/content/blog/*.mdx`, parses frontmatter with gray-matter, calculates reading time, sorts by date desc
- `getPostBySlug(slug)`: finds single post
- `getPostsByCategory(category)`: filters by category

**Step 2: Create 2 starter MDX posts**

`content/blog/the-shot-development-hierarchy.mdx`:
- Frontmatter: title, excerpt, category "Coaching", date "2026-02-27"
- Content: 3 sections on Placement, Speed, Spin hierarchy

`content/blog/community-is-the-moat.mdx`:
- Frontmatter: title, excerpt, category "Entrepreneurship", date "2026-02-25"
- Content: Why community beats product, lessons from building programs

**Step 3: Commit**

```bash
git add -A && git commit -m "feat: add blog infrastructure with MDX parser and 2 starter posts"
```

---

## Task 9: Blog Listing Page

**Files:**
- Create: `src/app/blog/page.tsx`

**Step 1: Build blog listing**

- Page heading + description
- Category filter pills: All, Coaching, Parenting, Entrepreneurship, Leadership
- Post cards: category tag (blue pill), date, read time, title, excerpt
- Cards link to `/blog/[slug]`
- Empty state: "Posts coming soon"

Export metadata: `title: "Blog"`

**Step 2: Verify at /blog — shows 2 posts**

**Step 3: Commit**

```bash
git add -A && git commit -m "feat: add blog listing page with category filters"
```

---

## Task 10: Blog Post Page (Dynamic Route)

**Files:**
- Create: `src/app/blog/[slug]/page.tsx`

**Step 1: Build dynamic post page**

- `generateStaticParams()` from `getAllPosts()`
- `generateMetadata()` from post frontmatter
- Render: category pill, date, read time, title, excerpt, then MDX content via `<MDXRemote source={post.content} />`
- Prose styling: `prose prose-invert prose-lg` with heading and link color overrides
- 404 via `notFound()` if slug not found

**Step 2: Verify at /blog/the-shot-development-hierarchy**

**Step 3: Commit**

```bash
git add -A && git commit -m "feat: add dynamic blog post page with MDX rendering"
```

---

## Task 11: Contact Page

**Files:**
- Create: `src/app/contact/page.tsx`

**Step 1: Build Contact page**

2-column grid layout:
- Left: `<LeadForm heading="Get in Touch" />`
- Right: Direct contact (email + phone), Social links (all 5 platforms, pink hover), Free Evaluation callout card

Export metadata: `title: "Contact"`

**Step 2: Verify at /contact**

**Step 3: Commit**

```bash
git add -A && git commit -m "feat: add Contact page with lead form and direct info"
```

---

## Task 12: Lead Form API Route (Notion Integration)

**Files:**
- Create: `src/app/api/leads/route.ts`

**Step 1: Build the API route**

- Import `Client` from `@notionhq/client`
- POST handler: parse JSON body (name, email, interest)
- Validate required fields, return 400 if missing
- Create Notion page with properties: Name (title), Email (email), Interest (select), Status (select: "New"), Date Submitted (date: ISO string)
- Return `{ success: true }` or 500 on error

**Step 2: Set up Notion database**

Sam needs to:
1. Create Notion integration at notion.so/my-integrations
2. Create "Website Leads" database with properties: Name (title), Email (email), Interest (select with 6 options), Status (select: New/Contacted/Converted), Date Submitted (date)
3. Share database with integration
4. Add API key and DB ID to `.env.local`

**Step 3: Test with curl**

```bash
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","interest":"Just Curious"}'
```
Expected: `{"success":true}` + new row in Notion

**Step 4: Commit**

```bash
git add -A && git commit -m "feat: add /api/leads route with Notion integration"
```

---

## Task 13: SEO — Structured Data, Sitemap, Robots

**Files:**
- Modify: `src/app/layout.tsx`
- Create: `src/app/sitemap.ts`
- Create: `src/app/robots.ts`

**Step 1: Add Person schema structured data to layout**

Add `<script type="application/ld+json">` in layout body with Person schema: name, jobTitle, description, email, telephone, address (Montgomery County, MD), sameAs (social URLs).

**Step 2: Create sitemap.ts**

Dynamic sitemap including all 5 static pages + all blog post URLs from `getAllPosts()`.

**Step 3: Create robots.ts**

Allow all, reference sitemap URL.

**Step 4: Commit**

```bash
git add -A && git commit -m "feat: add SEO — structured data, sitemap, robots.txt"
```

---

## Task 14: Homepage Blog Preview (Wire Up Real Posts)

**Files:**
- Modify: `src/app/page.tsx`

**Step 1: Replace blog placeholder with real posts**

Import `getAllPosts`, render 2-3 most recent as linked cards in the "From the Blog" section.

**Step 2: Verify homepage shows real blog post cards**

**Step 3: Commit**

```bash
git add -A && git commit -m "feat: wire homepage blog section to real MDX posts"
```

---

## Task 15: GitHub Repo + Vercel Deploy

**Step 1: Create GitHub repo and push**

```bash
gh repo create sammorrispb/sam-morris-website --public --source=. --remote=origin --push
```

**Step 2: Deploy to Vercel**

Import via Vercel dashboard or CLI. Add env vars (NOTION_API_KEY, NOTION_LEADS_DB_ID).

**Step 3: Verify production**

Visit Vercel URL, test all 5 pages, submit test lead.

**Step 4: Commit any fixes**

```bash
git add -A && git commit -m "chore: deployment configuration"
```

---

## Verification Checklist

- [ ] All 5 pages render (Home, About, Programs, Blog, Contact)
- [ ] Navigation works on desktop and mobile
- [ ] Lead form submits and appears in Notion
- [ ] Blog posts render with MDX
- [ ] Blog listing shows category tags and read time
- [ ] All fonts load (Montserrat, Inter, Roboto Mono)
- [ ] Colors match design spec (dark navy bg, electric blue/purple accents)
- [ ] Mobile responsive at 375px
- [ ] Meta tags present on all pages
- [ ] Sitemap accessible at /sitemap.xml
- [ ] Lighthouse scores 90+ on Performance, Accessibility, SEO
- [ ] Vercel deployment successful
