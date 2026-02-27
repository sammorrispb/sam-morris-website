# Sam Morris Personal Website — Design Document

**Date:** 2026-02-27
**Source of Truth:** Sam's Brand Guide (see brand-guide section in this doc)

---

## Context

Sam Morris is a sports coach, community builder, and entrepreneur in Montgomery County, MD. He runs five ventures (Dill Dinkers x2, Next Gen Academy, Link & Dink, Private Coaching) and needs a personal brand website that:

1. **Captures leads** — players and parents looking for sport activities in MoCo
2. **Positions Sam as THE local authority** — story-first, programs second
3. **Routes visitors** to the right business/program for them
4. **Builds credibility** through blog content across 4 pillars
5. **Connects social presence** across 5 platforms

---

## Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Typography:** Montserrat (headings), Inter (body), Roboto Mono (stats) — via `next/font/google`
- **Blog:** MDX files committed to repo (no CMS)
- **Lead Storage:** Notion API (leads database)
- **Email Notification:** Notion webhook or simple email via Vercel serverless
- **Deployment:** Vercel (GitHub auto-deploy)
- **Analytics:** Vercel Analytics + Google Analytics + Search Console (SEO)

---

## Color Palette — Dark and Electric

| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| Background | Deep Navy | `#0a0e27` | Page background |
| Surface | Midnight Blue | `#141937` | Cards, panels, nav |
| Primary Accent | Electric Blue | `#3b82f6` | CTAs, links, highlights |
| Secondary Accent | Vivid Purple | `#8b5cf6` | Hover states, gradients |
| Energy Pop | Hot Pink | `#ec4899` | Badges, social icons, alerts |
| Highlight | Lime Green | `#a3e635` | EASE framework, success states |
| Text | Off-White | `#f0f0f5` | Body text |
| Muted | Slate | `#94a3b8` | Captions, metadata, timestamps |
| Gradient | Blue to Purple | `linear-gradient(135deg, #3b82f6, #8b5cf6)` | Hero bg, CTA buttons |
| Border Glow | Blue 14% | `rgba(59, 130, 246, 0.14)` | Card borders |

---

## Brand Voice

- **Friendly yet direct** — like talking to a coach you trust
- **Empathetic and action-oriented** — understand the parent's world
- **Strategic but human** — smart without being cold
- **Up-tempo and encouraging** — coach energy, not corporate energy

---

## Signature Framework: EASE

Front-and-center on the homepage. Four values:

| Value | Meaning | How It Shows Up |
|-------|---------|-----------------|
| **E**thics | Doing what's right, always | Fair play, integrity, respect |
| **A**ttitude | Positive, welcoming, motivating | Growth mindset, resilience |
| **S**kills | Technical excellence + strategic thinking | Red to Orange to Green to Yellow pathway |
| **E**xcellence | Continuous improvement | Preparedness, consistency, pride |

---

## Pages

### 1. Home (`/`)

**Goal:** Establish trust, showcase EASE, preview programs, capture leads.

**Sections (top to bottom):**

1. **Hero** — Gradient background (navy to midnight blue), glow effects
   - Headline: *"Better than yesterday — together."*
   - Subhead: *"I help families grow through sport. Coach. Builder. Dad."*
   - CTAs: `[Book a Free Evaluation]` `[Explore Programs]`
   - Photo placeholder for coaching action shot

2. **Social Proof Bar** — Horizontal strip with glowing stat counters (Roboto Mono)
   - 20+ Yrs Coaching | 2 Facilities | 500+ Players Weekly | M.S. in Coaching | Gold Medalist

3. **EASE Framework** — 4 glowing cards (lime green accents)
   - Ethics, Attitude, Skills, Excellence — with brief descriptions

4. **Programs Preview** — 3 cards with electric glow borders
   - Next Gen Academy (Ages 5-16)
   - Private Lessons (1-on-1)
   - Link and Dink Community
   - `[See All Programs]` link

5. **Lead Form** — Centered glowing card
   - Heading: *"Ready to Play?"*
   - Fields: Name, Email, Interest (dropdown)
   - Interest options: Open Play, Coaching / Private Lessons, Next Gen Academy, Group Programs, Corporate Events, Just Curious
   - Submit: `[Let's Go]`
   - Submissions go to Notion database + email to sam.morris2131@gmail.com

6. **Latest Blog Posts** — 2-3 most recent post cards

7. **Footer** — Social icons (IG, FB, LinkedIn, TikTok, YouTube), email, phone, copyright

### 2. About (`/about`)

**Goal:** Build deep trust through Sam's story.

**Content (from brand guide):**
- Origin: Adopted from Hong Kong at 1.5, grew up in Takoma Park, MD
- Athletic roots: Varsity baseball/soccer at Montgomery Blair HS (Class of 2006)
- Education: B.S. Exercise Science (McDaniel) then M.S. Coaching (Ball State)
- Teaching career: 9 years as PE teacher across multiple schools
- Competitive highlight: Mixed Gender Gold, Legends Tournament
- Career pivot (2023): Dill Dinkers Assistant Manager then Director of Programming
- Family: Wife Kelly, sons Kobe (2019) and Owen (2023), Olney MD
- Current ventures: Next Gen Academy + Link and Dink

**Visual treatment:**
- Timeline/milestone visual with glowing connectors on dark background
- Coaching philosophy quote block (styled pull quote)
- Photo placeholders for action shots

### 3. Programs (`/programs`)

**Goal:** Clear pathways so visitors self-select quickly. No pricing.

**Sections:**
- **Next Gen Academy** (Youth, ages 5-16)
  - Red (Beginner), Orange (Advanced Beginner), Green (Intermediate), Yellow (Coach-curated)
  - Color-coded level cards
  - Free 30-minute evaluation CTA
  - Link: nexgenpbacademy.com

- **Private Lessons**
  - 1-on-1 coaching, all skill levels
  - CTA links to lead form

- **Link and Dink Community**
  - Social discovery app for players
  - Link: linkanddink.com

### 4. Blog (`/blog`)

**Goal:** Build authority, support SEO, nurture community.

**Features:**
- Category filter tabs: Coaching | Parenting | Entrepreneurship | Leadership
- Post cards: category tag, title, excerpt, date, read time
- Individual post pages at `/blog/[slug]`
- MDX files in `/content/blog/` directory

**Starter posts (from brand guide):**
- The Shot Development Hierarchy
- Why Kids Fall in Love (It's Not What You Think)
- Community Is the Moat
- My Dad's Rolodex

### 5. Contact (`/contact`)

**Goal:** Make it dead simple to reach Sam.

**Content:**
- Email: sam.morris2131@gmail.com
- Phone: 301-325-4731
- Lead form (same as homepage: Name, Email, Interest)
- Book a Free Evaluation CTA
- Social links: Instagram, Facebook, LinkedIn, TikTok, YouTube

---

## Lead Form to Notion Integration

- **Notion Database:** Create a "Website Leads" database under the existing Notion workspace
- **Fields:** Name, Email, Interest, Date Submitted, Status (New/Contacted/Converted)
- **Flow:** Form submit then Next.js API route then Notion API (create page) + email notification
- **Email:** Send notification to sam.morris2131@gmail.com on each submission

---

## Social Links

| Platform | To be provided by Sam |
|----------|----------------------|
| Instagram | URL needed |
| Facebook | URL needed |
| LinkedIn | URL needed |
| TikTok | URL needed |
| YouTube | URL needed |

---

## SEO Strategy

- **Target keywords:** local sport coaching, youth programs Montgomery County, coaching Maryland
- **Meta descriptions** per page
- **Blog posts** optimized for long-tail keywords
- **Structured data** (LocalBusiness schema)
- **Google Search Console** from day one

---

## Key Links

| Resource | URL |
|----------|-----|
| Next Gen Academy | www.nexgenpbacademy.com |
| Link and Dink | www.linkanddink.com |
| Email | sam.morris2131@gmail.com |
| Phone | 301-325-4731 |

---

## Social Proof Markers (weave throughout site)

- 20+ years of coaching across multiple sports and age groups
- Director of Programming at two Dill Dinkers locations
- M.S. in Coaching from Ball State University
- Former MCPS Physical Educator (9 years)
- Co-founder of Next Gen Academy and Link and Dink
- Competitive player — Mixed Gender Gold (Legends Tournament, Open Division)
- Manages 20-30 coaches across two facilities
- Programs hundreds of players weekly
- MoCo's only structured youth pathway (Red to Yellow)

---

## Verification Plan

1. **Dev server:** `npm run dev` — verify all 5 pages render, navigation works
2. **Lead form:** Submit test lead — verify it appears in Notion database + email received
3. **Blog:** Create test MDX post — verify it renders at `/blog/test-slug` with category filter
4. **Responsive:** Test on mobile viewport (375px) — all pages, nav, form usable
5. **SEO:** Check meta tags, structured data, og:image on each page
6. **Lighthouse:** Run audit — target 90+ on Performance, Accessibility, SEO
7. **Deploy:** Push to GitHub — verify Vercel auto-deploy works
