import { Client } from "@notionhq/client";
import { formatLessonDateTime } from "./lessons";

const DEFAULT_SKILLS = [
  { skill: "Serve placement", category: "Serves" },
  { skill: "Serve power", category: "Serves" },
  { skill: "Serve variety", category: "Serves" },
  { skill: "Deep return", category: "Returns" },
  { skill: "Drop return", category: "Returns" },
  { skill: "Drive return", category: "Returns" },
  { skill: "Cross-court dink", category: "Dinks" },
  { skill: "Dink placement", category: "Dinks" },
  { skill: "Speed-up from dink", category: "Dinks" },
  { skill: "Third shot drop", category: "Drops" },
  { skill: "Transition zone drop", category: "Drops" },
  { skill: "Reset drop", category: "Drops" },
  { skill: "Punch volley", category: "Volleys" },
  { skill: "Roll volley", category: "Volleys" },
  { skill: "Erne/ATP", category: "Volleys" },
  { skill: "Offensive lob", category: "Lobs" },
  { skill: "Defensive lob", category: "Lobs" },
  { skill: "Forehand drive", category: "Drives" },
  { skill: "Backhand drive", category: "Drives" },
  { skill: "Stacking", category: "Positioning" },
  { skill: "Transition zone movement", category: "Positioning" },
  { skill: "Court coverage", category: "Positioning" },
  { skill: "Pattern play", category: "Strategy" },
  { skill: "Poaching", category: "Strategy" },
  { skill: "Shot selection", category: "Mental" },
  { skill: "Pace control", category: "Mental" },
  { skill: "Recovery after errors", category: "Mental" },
] as const;

interface CreateCoachingClientOptions {
  name: string;
  email: string;
  hoursPurchased: number;
  source: string;
  skillLevel?: string;
}

interface CreateCoachingClientResult {
  clientPageId: string;
  skillCount: number;
  skipped: false;
}

interface SkippedResult {
  skipped: true;
  reason: string;
}

/**
 * Find a coaching client page id by email. Returns null when none exists.
 */
export async function findClientByEmail(
  notion: Client,
  clientsDbId: string,
  email: string
): Promise<string | null> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response: any = await notion.dataSources.query({
    data_source_id: clientsDbId,
    filter: { property: "Email", email: { equals: email } },
    page_size: 1,
  });
  return response.results?.[0]?.id ?? null;
}

interface UpsertCoachingClientOptions {
  name: string;
  email: string;
  source: string;
  skillLevel?: string;
}

/**
 * Get-or-create a coaching client by email. Lesson-source clients are
 * created lean (no skill progression rows — those belong to the legacy
 * package flow). Never throws for a duplicate; returns the existing id.
 */
export async function upsertCoachingClient(
  notion: Client,
  clientsDbId: string,
  options: UpsertCoachingClientOptions
): Promise<{ clientPageId: string; created: boolean }> {
  const existing = await findClientByEmail(
    notion,
    clientsDbId,
    options.email.trim().toLowerCase()
  );
  if (existing) {
    return { clientPageId: existing, created: false };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const properties: Record<string, any> = {
    Name: { title: [{ text: { content: options.name } }] },
    Email: { email: options.email.trim().toLowerCase() },
    "Hours Purchased": { number: 0 },
    "Hours Used": { number: 0 },
    Status: { select: { name: "Active" } },
    Source: { select: { name: options.source } },
    Created: { date: { start: new Date().toISOString().split("T")[0] } },
  };
  if (options.skillLevel) {
    properties["Skill Level"] = { select: { name: options.skillLevel } };
  }

  const clientPage = await notion.pages.create({
    parent: { data_source_id: clientsDbId },
    properties,
  });
  return { clientPageId: clientPage.id, created: true };
}

interface CreateLessonRowOptions {
  clientPageId: string;
  playerName: string;
  dateIso: string;
  location: string;
  durationMin: number;
  amountCents: number;
}

/**
 * Append one row to the Lessons database for a confirmed lesson.
 * Lesson history is append-only: re-proposing never overwrites a row.
 * The Lessons DB is optional — callers check NOTION_LESSONS_DB_ID first.
 */
export async function createLessonRow(
  notion: Client,
  lessonsDbId: string,
  options: CreateLessonRowOptions
): Promise<string> {
  const page = await notion.pages.create({
    parent: { data_source_id: lessonsDbId },
    properties: {
      Name: {
        title: [
          {
            text: {
              content: `Lesson — ${options.playerName} — ${formatLessonDateTime(options.dateIso)}`,
            },
          },
        ],
      },
      Player: { relation: [{ id: options.clientPageId }] },
      Date: { date: { start: options.dateIso } },
      Location: { rich_text: [{ text: { content: options.location } }] },
      "Duration (min)": { number: options.durationMin },
      "Amount (cents)": { number: options.amountCents },
      Status: { select: { name: "Confirmed" } },
    },
  });
  return page.id;
}

/**
 * Create a coaching client in Notion with 27 skill progression rows.
 * Deduplicates by email — returns early if client already exists.
 */
export async function createCoachingClient(
  notion: Client,
  clientsDbId: string,
  skillsDbId: string,
  options: CreateCoachingClientOptions
): Promise<CreateCoachingClientResult | SkippedResult> {
  const { name, email, hoursPurchased, source, skillLevel } = options;

  // Dedup check
  const existingId = await findClientByEmail(notion, clientsDbId, email);
  if (existingId) {
    return { skipped: true, reason: `Client already exists for ${email}` };
  }

  // Build properties
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const properties: Record<string, any> = {
    Name: { title: [{ text: { content: name } }] },
    Email: { email },
    "Hours Purchased": { number: hoursPurchased },
    "Hours Used": { number: 0 },
    Status: { select: { name: hoursPurchased > 0 ? "Active" : "Trial" } },
    Source: { select: { name: source } },
    Created: { date: { start: new Date().toISOString().split("T")[0] } },
  };

  if (skillLevel) {
    properties["Skill Level"] = { select: { name: skillLevel } };
  }

  const clientPage = await notion.pages.create({
    parent: { data_source_id: clientsDbId },
    properties,
  });

  // Create skill progression rows (batch in groups of 5 to respect rate limits)
  let skillCount = 0;
  const batchSize = 5;
  for (let i = 0; i < DEFAULT_SKILLS.length; i += batchSize) {
    const batch = DEFAULT_SKILLS.slice(i, i + batchSize);
    await Promise.all(
      batch.map((s) =>
        notion.pages.create({
          parent: { data_source_id: skillsDbId },
          properties: {
            Skill: { title: [{ text: { content: s.skill } }] },
            Client: { relation: [{ id: clientPage.id }] },
            Category: { select: { name: s.category } },
            Level: { select: { name: "Introduced" } },
          },
        })
      )
    );
    skillCount += batch.length;
  }

  return { clientPageId: clientPage.id, skillCount, skipped: false };
}
