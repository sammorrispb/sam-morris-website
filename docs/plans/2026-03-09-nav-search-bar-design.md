# Nav Search Bar — Design

**Date:** 2026-03-09
**Status:** Approved

## Summary

Add a search bar to the site nav that lets users find any page, blog post, or in-page section. Uses a build-time search index with Fuse.js for instant, client-side fuzzy search.

## Decisions

- **Approach:** Build-time JSON index + Fuse.js (client-side fuzzy search, ~7KB)
- **UI pattern:** Icon-first — magnifying glass in nav, expands input on click
- **Results:** Dropdown below input (up to 8 results), keyboard navigable
- **Searchable content:** Pages, blog posts, and in-page sections (h2/h3 headings with anchors)

## Search Index

Generated at build time by `scripts/generate-search-index.ts`, output to `public/search-index.json` (gitignored).

Each entry:
```ts
{
  title: string;       // "Youth & Junior Programs" or "EASE Framework"
  description: string; // snippet of surrounding text
  url: string;         // "/programs/youth" or "/about#ease-framework"
  type: "page" | "blog" | "section";
  category?: string;   // blog category or parent page name
}
```

Sources:
- **Pages** — title + description from metadata exports in each page.tsx
- **Blog posts** — title, excerpt, category, content from MDX files in content/blog/
- **In-page sections** — h2/h3 headings with surrounding text, linked via anchor (e.g. `/about#timeline`)

## Search UI

### SearchBar.tsx (client component)

**Collapsed:** Magnifying glass icon in nav. Desktop: between links and CTA. Mobile: left of hamburger.

**Expanded:** Input field slides open. Desktop: inline in nav. Mobile: full-width below nav bar.

**Dropdown:** Up to 8 results, each showing:
- Type badge (Page / Blog / Section)
- Title with match highlighting
- One-line description snippet
- Keyboard nav: arrow keys + Enter to select, Escape to close

**Closing:** Click outside, Escape, or navigating to a result.

**Styling:** `bg-navy/95 backdrop-blur-md`, `glow-border`, hover highlight `bg-white/5`.

### Fuse.js Config

- Keys: `title` (weight 2), `description` (weight 1), `category` (weight 0.5)
- Threshold: 0.4
- Max results: 8

### Index Loading

Lazy-loaded on first search icon click, cached in component state. Zero impact on initial page load.

## Nav.tsx Integration

- `searchOpen` state; opening search closes mobile menu and vice versa
- Search icon positioned between nav links and CTA (desktop), left of hamburger (mobile)

## New Files

| File | Purpose |
|------|---------|
| `scripts/generate-search-index.ts` | Build-time index generator |
| `src/components/SearchBar.tsx` | Search UI component |
| `public/search-index.json` | Generated index (gitignored) |

## Package Changes

- Add `fuse.js` dependency
- Add `"search-index"` script to package.json
- Prepend index generation to `build` script

## No API Routes

Everything client-side after one-time JSON fetch.
