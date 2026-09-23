# Players CRM — admin coaching roster

The admin dashboard has a **Players** tab next to **Leads**. It reads the
existing Coaching Clients Notion database as the player roster, appends one
row per confirmed lesson to the existing Lesson Log database, and reads payments live
from Stripe so there is nothing to keep in sync.

## Components

- `src/lib/players.ts` — `PLAYER_LEVELS` (Beginner / Intermediate / Advanced),
  `mapClientPage`, `mapLessonPage`, email validation. Client-safe.
- `src/lib/coaching-crm.ts` — `upsertCoachingClient` (get-or-create by
  email, lean — no skill rows), `createLessonRow` (append-only lesson
  history), `findClientByEmail`. `createCoachingClient` (legacy Stripe
  package flow) now dedups through `findClientByEmail`.
- `src/app/api/admin/players/route.ts`
  - `GET` — list players from the Coaching Clients DB. Query params:
    `search` (name or email), `level`, `cursor`, `pageSize`.
  - `PATCH` — `{ pageId, level?, notes? }`. Level validated against
    `PLAYER_LEVELS`.
  - `POST` — `{ name, email, level? }`. 409 when the email already exists.
- `src/app/api/admin/players/[id]/route.ts` — `GET` returns the player,
  lesson history (when the Lessons DB is configured), and live Stripe
  invoices matched by customer email (newest first, with hosted invoice
  links). Stripe and lessons failures degrade to empty lists, never 500s.
- `src/app/api/lessons/confirm/route.ts` — after a player confirms a
  lesson, upserts the coaching client (source "Lesson") and appends a
  lesson row. Fail-open: a CRM write error is logged but never breaks the
  confirmation.
- `src/components/admin/PlayersPanel.tsx` — search, level filter, inline
  level dropdown in the table, Add player modal, and a detail drawer with
  editable level + notes, lesson history, and Stripe invoices.
- `src/components/admin/AdminDashboard.tsx` — Leads | Players tabs.

## Environment

| Var | Required | Purpose |
| --- | --- | --- |
| `NOTION_COACHING_CLIENTS_DB_ID` | yes | Coaching Clients database id (`677e2804-a7a6-4b35-9c81-89c490b0318d`) |
| `NOTION_COACHING_SKILLS_DB_ID` | for webhook | Skill Progression database id (`1bb74376-6359-4cca-b9e5-6b0c8e233e9c`) — the Stripe webhook creates 27 skill rows per new client |
| `NOTION_LESSONS_DB_ID` | for history | Points at the **existing Lesson Log** database (`f3f31ff4-84fa-44b5-9b59-3938a9a94130`), not a new DB |
| `STRIPE_SECRET_KEY` | for payments | Already configured; used for live invoice lookup by email |

When `NOTION_LESSONS_DB_ID` is unset, the Players tab still lists players,
levels, and notes; the drawer shows a "not configured" hint for lesson
history. When `STRIPE_SECRET_KEY` is unset, the drawer notes Stripe is not
configured.

## Lesson Log database (existing — reused, not created)

The Players CRM reuses the existing **Lesson Log** database
(`f3f31ff4-84fa-44b5-9b59-3938a9a94130`), which already has a `Client`
relation → Coaching Clients. No new database is needed.

| Property | Type | Notes |
| --- | --- | --- |
| Session | Title | e.g. `Lesson — Jane Doe — Tue, Sep 23 at 5:00 PM ET` |
| Client | Relation | → Coaching Clients database (already wired) |
| Date | Date | Lesson start |
| Location | Select | New locations become new options automatically |
| Duration | Select | `30min` / `1hr` / `1.5hr` / `2hr` (code maps minutes to the nearest bucket) |
| Hours Charged | Number | Legacy billing unit |
| Amount (cents) | Number | Added 2026-09-23 for the CRM (`5000` for a 60-min lesson) |
| Focus Areas | Multi-select | Existing |
| Session Notes | Rich text | Existing |

Schema changes made 2026-09-23 (all additive, existing data untouched):

- Coaching Clients `Skill Level` select: added `Beginner`, `Intermediate`,
  `Advanced` alongside the existing DUPR-number options.
- Coaching Clients `Source` select: added `Lesson`, `Manual`.
- Lesson Log: added `Amount (cents)` number property.

Vercel env (production, preview, development):

- `NOTION_COACHING_CLIENTS_DB_ID=677e2804-a7a6-4b35-9c81-89c490b0318d`
- `NOTION_COACHING_SKILLS_DB_ID=1bb74376-6359-4cca-b9e5-6b0c8e233e9c`
- `NOTION_LESSONS_DB_ID=f3f31ff4-84fa-44b5-9b59-3938a9a94130`

Setting the clients/skills ids activates the Stripe webhook's CRM path
(previously dormant — the vars were never set): new purchases create a
client plus 27 skill-progression rows, which then appear in the Players tab.
Until the vars are set, lesson confirmations still upsert players — only the
history rows are skipped.
