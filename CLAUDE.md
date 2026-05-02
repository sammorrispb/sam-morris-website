# Sam Morris Website — CLAUDE.md

**NOTE (2026-05-02):** This site was decoupled from Dill Dinkers / CourtReserve / The Hub on 2026-05-02. The Hub (linkanddink.com) DNS is OFFLINE. No DD/CR/Hub references should be re-introduced.

## What This Is
Personal/professional website for Sam Morris — coach, community builder, and entrepreneur based in Montgomery County, MD. Showcases coaching programs, blog, and contact.

## Ecosystem (current)
- **Next Gen Academy** (`sammorrispb/nextgen-academy`) — Youth academy site
- **Open Brain** (`sammorrispb/open-brain`) — Semantic knowledge + MCP server
- **MoCo PB** (`sammorrispb/mocopb`) — Local SEO lead gen site
- **Tournament Series** (`sammorrispb/tournament-website`) — Public tournament results

- **Domain**: sammorrispb.com
- **Git**: github.com/sammorrispb/sam-morris-website
- **Deploy**: Vercel (auto-deploy on push to main)

## Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Fonts**: Montserrat (headings), Inter (body), Roboto Mono (code)
- **Analytics**: @vercel/analytics
- **CMS**: Notion API (@notionhq/client) for blog posts
- **Email**: Nodemailer for contact form
- **Payments**: Stripe Payment Links (no SDK/webhooks)
- **DB**: Supabase (admin features)

## Key Routes
- `/` — Homepage
- `/about` — Bio, EASE framework
- `/programs` — Program hub
- `/programs/coaching` — Private lessons with Stripe Payment Links ($130 single, $400 4-pack)
- `/evaluation` — Free skill evaluation landing page
- `/blog` — Notion-powered blog with MDX rendering
- `/contact` — Contact form (Nodemailer)
- `/admin` — Admin dashboard

## Key Files
- `src/lib/coaching.ts` — Stripe Payment Links (`SINGLE_LESSON_LINK`, `FOUR_PACK_LINK`)
- `src/lib/blog.ts` — Notion blog integration
- `src/lib/constants.ts` — Site-wide constants
- `docs/brand-guide.md` — Sam's personal brand guide (EASE framework, positioning)

## Conventions
- App Router (Next.js 16) — pages in `src/app/`, components in `src/components/`
- Tailwind v4 — use `@tailwindcss/postcss`, no tailwind.config file
- TypeScript strict mode
- Server Components by default, `"use client"` only when needed
- JSON-LD structured data on program pages for rich snippets
- ESLint via `eslint-config-next`

## Development
```
npm run dev    # Start dev server
npm run build  # Production build
npm run lint   # ESLint
```

## Notes for Claude Code
- This is Sam's personal site. He is building technical skills while developing it.
- Prefer simple, readable code. Explain non-obvious decisions.
- Always consider mobile responsiveness.
- Stripe Payment Links are external — no server-side Stripe processing needed.

## Testing Standards
- **Build must pass**: `npm run build` with zero errors before every push
- **Test behavior, not implementation** — validate what pages render and how APIs respond, not internal code paths
- **Form validation**: Test contact form and any user inputs against XSS, injection, and empty/malformed data
- **Mobile-first**: Visually verify all pages on mobile viewport before shipping layout changes
- **Notion API**: Test that blog pages handle Notion API failures gracefully (timeout, empty response)
