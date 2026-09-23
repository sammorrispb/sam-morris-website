# Players CRM — admin coaching roster

The admin dashboard has a **Players** tab next to **Leads**. It reads the
existing Coaching Clients Notion database as the player roster, appends one
row per confirmed lesson to a Lessons database, and reads payments live
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
| `NOTION_COACHING_CLIENTS_DB_ID` | yes | Existing Coaching Clients database id (already used by the Stripe webhook) |
| `NOTION_LESSONS_DB_ID` | for history | Lessons database id (new, see below) |
| `STRIPE_SECRET_KEY` | for payments | Already configured; used for live invoice lookup by email |

When `NOTION_LESSONS_DB_ID` is unset, the Players tab still lists players,
levels, and notes; the drawer shows a "not configured" hint for lesson
history. When `STRIPE_SECRET_KEY` is unset, the drawer notes Stripe is not
configured.

## Lessons database schema (create once in Notion)

Parent: the same workspace area as the Coaching Clients database.

| Property | Type | Notes |
| --- | --- | --- |
| Name | Title | e.g. `Lesson — Jane Doe — Tue, Sep 23 at 5:00 PM ET` |
| Player | Relation | → Coaching Clients database |
| Date | Date | Lesson start |
| Location | Rich text | Full address |
| Duration (min) | Number | 60 |
| Amount (cents) | Number | 5000 for a 60-min lesson |
| Status | Select | `Confirmed` (later: `Paid`, `Cancelled`) |
| Stripe Invoice URL | URL | Filled when the invoice goes out |
| Calendar Event ID | Rich text | Fulfillment writes this |

Setup:

1. Create the database with the schema above (Notion UI, or API with the
   `Player` relation pointing at the Coaching Clients database id).
2. Share it with the same integration that owns the leads/clients databases.
3. Set `NOTION_LESSONS_DB_ID` to the new database id in Vercel
   (production) and in `.env.local` for development.
4. Redeploy.

Until step 3 is done, lesson confirmations still upsert players — only the
history rows are skipped.
