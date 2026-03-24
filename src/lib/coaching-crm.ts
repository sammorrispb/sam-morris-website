import { Client } from "@notionhq/client";

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
 * Check if a coaching client already exists for the given email.
 */
async function hasExistingClient(
  notion: Client,
  clientsDbId: string,
  email: string
): Promise<boolean> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response: any = await notion.dataSources.query({
    data_source_id: clientsDbId,
    filter: { property: "Email", email: { equals: email } },
    page_size: 1,
  });
  return (response.results?.length ?? 0) > 0;
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
  const exists = await hasExistingClient(notion, clientsDbId, email);
  if (exists) {
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
