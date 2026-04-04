# Sam Morris Website — CLAUDE.md

## What This Is
Personal/professional website for Sam Morris — coach, community builder, and entrepreneur based in Montgomery County, MD. Showcases coaching programs, Dill Dinkers locations, blog, and contact.

## Ecosystem
Part of Sam's pickleball platform ecosystem. See also:
- **The Hub** (`sammorrispb/The-Hub`) — Core community platform at play.linkanddink.com
- **Next Gen Academy** (`sammorrispb/nextgen-academy`) — Youth academy site
- **Open Brain** (`sammorrispb/open-brain`) — Semantic knowledge + MCP server
- **CourtReserve Ops** (`sammorrispb/courtreserve-ops`) — DD operations plugin

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
- `/programs` — Program hub + sub-pages (coaching, youth, leagues, tournaments, open-play, coached-open-play, hub)
- `/programs/coaching` — Private lessons with Stripe Payment Links ($130 single, $400 4-pack)
- `/locations` — Dill Dinkers facility pages
- `/blog` — Notion-powered blog with MDX rendering
- `/contact` — Contact form (Nodemailer)
- `/admin` — Admin dashboard

## Key Files
- `src/lib/coaching.ts` — Stripe Payment Links (`SINGLE_LESSON_LINK`, `FOUR_PACK_LINK`)
- `src/lib/locations.ts` — Dill Dinkers location data
- `src/lib/blog.ts` — Notion blog integration
- `src/lib/constants.ts` — Site-wide constants
- `docs/brand-guide.md` — Sam's personal brand guide (EASE framework, positioning)
- `docs/Dill Dinkers Brand Guidelines.pdf` — DD brand colors, voice, trademark usage

## Dill Dinkers Brand Palette
Always reference `docs/Dill Dinkers Brand Guidelines.pdf` for DD-branded content:
- Dinker Orange: `#F47920`
- Baseline Blue: `#11254C`
- Spin Serve Lime: `#8BC751`
- Dink Drop Blue: `#4DACD0`
- Golden Paddle: `#FFCF31`
- Dill Green: `#078141`

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
- When updating /locations or DD-branded content, reference the Dill Dinkers Brand Guidelines PDF.
- Stripe Payment Links are external — no server-side Stripe processing needed.

## Testing Standards
- **Build must pass**: `npm run build` with zero errors before every push
- **Test behavior, not implementation** — validate what pages render and how APIs respond, not internal code paths
- **Form validation**: Test contact form and any user inputs against XSS, injection, and empty/malformed data
- **Mobile-first**: Visually verify all pages on mobile viewport before shipping layout changes
- **Notion API**: Test that blog pages handle Notion API failures gracefully (timeout, empty response)
