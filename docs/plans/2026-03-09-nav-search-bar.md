# Nav Search Bar Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a client-side fuzzy search bar to the nav that searches all pages, blog posts, and in-page sections.

**Architecture:** Build-time script generates a JSON search index from page metadata, blog MDX files, and JSX section headings. At runtime, Fuse.js performs fuzzy matching against the lazy-loaded index. Results appear in a dropdown below an expandable search input in the nav.

**Tech Stack:** Fuse.js (~7KB), Next.js 16 App Router, TypeScript, Tailwind v4

---

### Task 1: Install Fuse.js and add search-index script

**Files:**
- Modify: `package.json`
- Modify: `.gitignore`

**Step 1: Install fuse.js**

Run: `cd /home/passwd/sam-morris-website && npm install fuse.js`

**Step 2: Add search-index script and update build**

In `package.json`, update the `scripts` section:
```json
"scripts": {
  "dev": "next dev",
  "build": "npx tsx scripts/generate-search-index.ts && next build",
  "start": "next start",
  "lint": "eslint",
  "search-index": "npx tsx scripts/generate-search-index.ts"
}
```

**Step 3: Add tsx as dev dependency**

Run: `npm install -D tsx`

**Step 4: Gitignore the generated index**

Add to `.gitignore`:
```
# search index (generated at build time)
/public/search-index.json
```

**Step 5: Commit**

```bash
git add package.json package-lock.json .gitignore
git commit -m "chore: add fuse.js and search-index build script"
```

---

### Task 2: Create the search index generator

**Files:**
- Create: `scripts/generate-search-index.ts`

**Step 1: Create the script**

The script must:
1. Define a `SearchEntry` type: `{ title, description, url, type, category? }`
2. Scan all `src/app/**/page.tsx` files for `metadata` exports (title + description)
3. Parse JSX for `<h2>` and `<h3>` headings with `id` attributes to create section entries with anchor URLs
4. Parse all `content/blog/*.mdx` files with `gray-matter` for title, excerpt, category
5. Write the combined array to `public/search-index.json`

Key details for parsing pages:
- Use regex to extract `metadata` object literal from each page file (title, description)
- Map file paths to URLs: `src/app/about/page.tsx` → `/about`, `src/app/programs/coaching/page.tsx` → `/programs/coaching`
- For sections: match `<section[^>]*id="([^"]+)"` and nearby `<h2>` / `<h3>` text content
- Strip JSX tags and entities from heading text

Key details for blog:
- Read MDX files from `content/blog/` using `gray-matter`
- URL pattern: `/blog/{slug}` where slug = filename without `.mdx`
- Include first ~150 chars of content as description if no excerpt

Expected output shape:
```json
[
  { "title": "About Sam Morris", "description": "Meet Sam Morris — PPR-certified...", "url": "/about", "type": "page" },
  { "title": "The Journey", "description": "Timeline of Sam's career...", "url": "/about#timeline", "type": "section", "category": "About" },
  { "title": "Community Is the Moat", "description": "Why community matters...", "url": "/blog/community-is-the-moat", "type": "blog", "category": "Leadership" }
]
```

**Step 2: Run the script and verify output**

Run: `npm run search-index`
Expected: Creates `public/search-index.json` with 30-50 entries covering pages, sections, and blog posts.

Verify: `cat public/search-index.json | npx json | head -40` — spot-check that URLs, titles, and types look correct.

**Step 3: Commit**

```bash
git add scripts/generate-search-index.ts
git commit -m "feat: add build-time search index generator"
```

---

### Task 3: Create the SearchBar component

**Files:**
- Create: `src/components/SearchBar.tsx`

**Step 1: Build the component**

The component needs these states:
- `open` — whether the input is expanded
- `query` — current search text
- `results` — Fuse.js results array
- `selectedIndex` — for keyboard navigation
- `index` — cached search index (loaded lazily)

Behavior:
- **Icon click:** Toggle `open`. On first open, fetch `/search-index.json` and initialize Fuse.
- **Typing:** Debounce 200ms, run `fuse.search(query)` with `{ limit: 8 }`.
- **Results dropdown:** Show up to 8 results. Each shows type badge, title, description snippet.
- **Keyboard:** ArrowDown/ArrowUp cycle `selectedIndex`, Enter navigates to `results[selectedIndex].url`, Escape closes.
- **Click outside:** Close via a `useEffect` that listens for clicks outside the component ref.
- **Navigation:** Use Next.js `useRouter().push()` to navigate, then close and clear.

Fuse.js init:
```ts
new Fuse(entries, {
  keys: [
    { name: "title", weight: 2 },
    { name: "description", weight: 1 },
    { name: "category", weight: 0.5 },
  ],
  threshold: 0.4,
  includeMatches: true,
})
```

Styling (matching existing design system):
- Search icon: `text-text-muted hover:text-text-primary transition-colors` (matches nav links)
- Input: `bg-navy-light border border-white/10 focus:border-accent-blue/50 rounded-lg text-sm text-text-primary placeholder:text-text-muted/50`
- Dropdown: `bg-navy/95 backdrop-blur-md glow-border rounded-xl mt-2 shadow-2xl max-h-[70vh] overflow-y-auto`
- Result items: `px-4 py-3 hover:bg-white/5 cursor-pointer transition-colors`
- Selected item (keyboard): `bg-white/5`
- Type badge: small pill — Page=`text-accent-blue`, Blog=`text-accent-purple`, Section=`text-accent-lime`
- Matched text highlight: `text-text-primary font-semibold` (rest is `text-text-muted`)

Desktop layout: icon sits between nav links and CTA. When open, input expands inline (~240px width).
Mobile layout: icon sits left of the hamburger. When open, full-width input appears below the nav bar.

Props: `onOpenChange?: (open: boolean) => void` — lets Nav.tsx coordinate with mobile menu.

**Step 2: Commit**

```bash
git add src/components/SearchBar.tsx
git commit -m "feat: add SearchBar component with fuzzy search dropdown"
```

---

### Task 4: Integrate SearchBar into Nav

**Files:**
- Modify: `src/components/Nav.tsx`

**Step 1: Add SearchBar to the nav**

Changes to Nav.tsx:
1. Import `SearchBar`
2. Add `searchOpen` state
3. When `searchOpen` changes, close mobile menu (`setMobileOpen(false)`)
4. When `mobileOpen` changes, close search (`setSearchOpen(false)`)
5. Desktop: Place `<SearchBar>` between the nav links `div` and the CTA `Link`
6. Mobile: Place `<SearchBar>` between the logo and the hamburger button

The desktop nav items section becomes:
```tsx
<div className="hidden md:flex items-center gap-6">
  {NAV_LINKS.map(/* ... existing ... */)}
  <SearchBar onOpenChange={(open) => { setSearchOpen(open); if (open) setMobileOpen(false); }} />
  <Link href="/contact" className="...btn-gradient">Book a Free Evaluation</Link>
</div>
```

Mobile: add SearchBar next to hamburger:
```tsx
<div className="flex md:hidden items-center gap-3">
  <SearchBar onOpenChange={(open) => { setSearchOpen(open); if (open) setMobileOpen(false); }} />
  <button type="button" ...>hamburger</button>
</div>
```

**Step 2: Test manually**

Run: `npm run search-index && npm run dev`

Verify:
- Desktop: magnifying glass appears between nav links and CTA
- Click icon → input expands, dropdown appears on typing
- Type "youth" → see Youth & Junior Programs result
- Type "EASE" → see EASE Framework section result
- Arrow keys navigate results, Enter navigates to page
- Escape closes, click outside closes
- Mobile: icon shows next to hamburger, expands full-width

**Step 3: Commit**

```bash
git add src/components/Nav.tsx
git commit -m "feat: integrate SearchBar into Nav with mobile support"
```

---

### Task 5: Polish and edge cases

**Files:**
- Modify: `src/components/SearchBar.tsx` (if needed)
- Modify: `src/app/globals.css` (if animation needed)

**Step 1: Handle edge cases**

- Empty state: when query is non-empty but no results, show "No results found" message
- Loading state: show a brief spinner/skeleton while fetching the index on first open
- Focus management: auto-focus the input when it opens
- Transition: add a smooth width transition on the input expanding/collapsing
- Mobile scroll lock: prevent background scroll when dropdown is open on mobile

**Step 2: Test the full build**

Run: `npm run build`
Expected: Build succeeds, `public/search-index.json` is generated before Next.js build runs.

Run: `npm run start` and test the search in production mode.

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: polish search bar UX — empty state, loading, transitions"
```
