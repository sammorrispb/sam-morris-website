import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const notionDataSourcesQuery = vi.fn();
const notionDatabasesRetrieve = vi.fn();
const notionPagesUpdate = vi.fn();
const notionPagesCreate = vi.fn();
const notionPagesRetrieve = vi.fn();

vi.mock("@notionhq/client", () => ({
  Client: class {
    dataSources = { query: notionDataSourcesQuery };
    databases = { retrieve: notionDatabasesRetrieve };
    pages = {
      update: notionPagesUpdate,
      create: notionPagesCreate,
      retrieve: notionPagesRetrieve,
    };
  },
}));

function makeReq(
  method: string,
  token: string | null,
  qs = "",
  body?: unknown
) {
  const cleanQs = qs.replace(/^\?/, "");
  const url = `https://www.sammorrispb.com/api/admin/players${cleanQs ? `?${cleanQs}` : ""}`;
  const headers = new Headers({ "content-type": "application/json" });
  if (token !== null) headers.set("Authorization", `Bearer ${token}`);
  return new Request(url, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

function clientPage(id: string, overrides: Record<string, unknown> = {}) {
  return {
    id,
    properties: {
      Name: { type: "title", title: [{ plain_text: "Test Player" }] },
      Email: { type: "email", email: "player@example.com" },
      Phone: { phone_number: null },
      "Skill Level": { select: { name: "Beginner" } },
      Status: { select: { name: "Active" } },
      Source: { select: { name: "Lesson" } },
      Notes: { type: "rich_text", rich_text: [] },
      "Hours Purchased": { number: 0 },
      "Hours Used": { number: 0 },
      Created: { created_time: "2026-09-01T12:00:00.000Z" },
      ...overrides,
    },
  };
}

beforeEach(() => {
  vi.resetAllMocks();
  process.env.ADMIN_PASSWORD = "test-admin-secret";
  process.env.NOTION_API_KEY = "test-notion-key";
  process.env.NOTION_COACHING_CLIENTS_DB_ID = "db_clients";
  notionDataSourcesQuery.mockResolvedValue({
    results: [],
    has_more: false,
    next_cursor: null,
  });
  notionDatabasesRetrieve.mockResolvedValue({
    data_sources: [{ id: "ds_test" }],
  });
  notionPagesUpdate.mockResolvedValue({});
  notionPagesCreate.mockResolvedValue({ id: "page_new" });
  notionPagesRetrieve.mockResolvedValue(clientPage("page_new"));
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("GET /api/admin/players", () => {
  it("returns 401 when Authorization header is missing", async () => {
    const { GET } = await import("@/app/api/admin/players/route");
    const res = await GET(makeReq("GET", null));
    expect(res.status).toBe(401);
    expect(notionDataSourcesQuery).not.toHaveBeenCalled();
  });

  it("returns 401 when token does not match ADMIN_PASSWORD", async () => {
    const { GET } = await import("@/app/api/admin/players/route");
    const res = await GET(makeReq("GET", "wrong"));
    expect(res.status).toBe(401);
  });

  it("returns 400 for an invalid level filter", async () => {
    const { GET } = await import("@/app/api/admin/players/route");
    const res = await GET(makeReq("GET", "test-admin-secret", "?level=Expert"));
    expect(res.status).toBe(400);
  });

  it("maps client pages to players and filters by search + level", async () => {
    const { GET } = await import("@/app/api/admin/players/route");
    notionDataSourcesQuery
      .mockResolvedValueOnce({
        results: [clientPage("p1"), clientPage("p2")],
        has_more: false,
        next_cursor: null,
      })
      .mockResolvedValue({ results: [], has_more: false, next_cursor: null });
    const res = await GET(
      makeReq("GET", "test-admin-secret", "?search=Test&level=Beginner")
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.total).toBe(0);
    expect(body.players).toHaveLength(2);
    expect(body.players[0]).toMatchObject({
      id: "p1",
      name: "Test Player",
      email: "player@example.com",
      level: "Beginner",
      status: "Active",
    });
    // The filtered query carries both the level and search conditions.
    const firstCall = notionDataSourcesQuery.mock.calls[0][0];
    expect(JSON.stringify(firstCall.filter)).toContain("Skill Level");
    expect(JSON.stringify(firstCall.filter)).toContain("Test");
  });

  it("normalizes unknown skill levels to empty string", async () => {
    const { GET } = await import("@/app/api/admin/players/route");
    notionDataSourcesQuery
      .mockResolvedValueOnce({
        results: [clientPage("p9", { "Skill Level": { select: { name: "Pro" } } })],
        has_more: false,
        next_cursor: null,
      })
      .mockResolvedValue({ results: [], has_more: false, next_cursor: null });
    const res = await GET(makeReq("GET", "test-admin-secret"));
    const body = await res.json();
    expect(body.players[0].level).toBe("");
  });
});

describe("PATCH /api/admin/players", () => {
  it("returns 401 without a valid token", async () => {
    const { PATCH } = await import("@/app/api/admin/players/route");
    const res = await PATCH(makeReq("PATCH", null, "", { pageId: "p1" }));
    expect(res.status).toBe(401);
    expect(notionPagesUpdate).not.toHaveBeenCalled();
  });

  it("rejects an invalid level", async () => {
    const { PATCH } = await import("@/app/api/admin/players/route");
    const res = await PATCH(
      makeReq("PATCH", "test-admin-secret", "", { pageId: "p1", level: "Expert" })
    );
    expect(res.status).toBe(400);
    expect(notionPagesUpdate).not.toHaveBeenCalled();
  });

  it("updates the Skill Level select on the client page", async () => {
    const { PATCH } = await import("@/app/api/admin/players/route");
    const res = await PATCH(
      makeReq("PATCH", "test-admin-secret", "", {
        pageId: "p1",
        level: "Intermediate",
      })
    );
    expect(res.status).toBe(200);
    expect(notionPagesUpdate).toHaveBeenCalledWith({
      page_id: "p1",
      properties: { "Skill Level": { select: { name: "Intermediate" } } },
    });
  });

  it("updates notes as rich text", async () => {
    const { PATCH } = await import("@/app/api/admin/players/route");
    const res = await PATCH(
      makeReq("PATCH", "test-admin-secret", "", {
        pageId: "p1",
        notes: "Working on backhand dinks.",
      })
    );
    expect(res.status).toBe(200);
    expect(notionPagesUpdate).toHaveBeenCalledWith({
      page_id: "p1",
      properties: {
        Notes: {
          rich_text: [{ text: { content: "Working on backhand dinks." } }],
        },
      },
    });
  });
});

describe("POST /api/admin/players", () => {
  it("returns 401 without a valid token", async () => {
    const { POST } = await import("@/app/api/admin/players/route");
    const res = await POST(makeReq("POST", null, "", { name: "A", email: "a@b.c" }));
    expect(res.status).toBe(401);
    expect(notionPagesCreate).not.toHaveBeenCalled();
  });

  it("requires a valid email", async () => {
    const { POST } = await import("@/app/api/admin/players/route");
    const res = await POST(
      makeReq("POST", "test-admin-secret", "", { name: "A", email: "not-an-email" })
    );
    expect(res.status).toBe(400);
    expect(notionPagesCreate).not.toHaveBeenCalled();
  });

  it("returns 409 when the email already exists", async () => {
    const { POST } = await import("@/app/api/admin/players/route");
    notionDataSourcesQuery.mockResolvedValueOnce({
      results: [clientPage("p1")],
      has_more: false,
      next_cursor: null,
    });
    const res = await POST(
      makeReq("POST", "test-admin-secret", "", {
        name: "Dup",
        email: "player@example.com",
      })
    );
    expect(res.status).toBe(409);
    expect(notionPagesCreate).not.toHaveBeenCalled();
  });

  it("creates the client and returns the mapped player", async () => {
    const { POST } = await import("@/app/api/admin/players/route");
    const res = await POST(
      makeReq("POST", "test-admin-secret", "", {
        name: "New Player",
        email: "new@example.com",
        level: "Advanced",
      })
    );
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.player).toMatchObject({ id: "page_new" });
    expect(notionPagesCreate).toHaveBeenCalled();
    const createArg = notionPagesCreate.mock.calls[0][0];
    expect(createArg.properties["Skill Level"]).toEqual({
      select: { name: "Advanced" },
    });
  });
});

describe("lib/players helpers", () => {
  it("validates levels and emails", async () => {
    const { isPlayerLevel, isValidEmail } = await import("@/lib/players");
    expect(isPlayerLevel("Beginner")).toBe(true);
    expect(isPlayerLevel("Intermediate")).toBe(true);
    expect(isPlayerLevel("Advanced")).toBe(true);
    expect(isPlayerLevel("Expert")).toBe(false);
    expect(isPlayerLevel("")).toBe(false);
    expect(isValidEmail("sam@example.com")).toBe(true);
    expect(isValidEmail("nope")).toBe(false);
    expect(isValidEmail("a@b")).toBe(false);
  });

  it("reads Created from created_time", async () => {
    const { mapClientPage } = await import("@/lib/players");
    const p = mapClientPage(
      clientPage("c1", { Created: { created_time: "2026-09-15T09:30:00.000Z" } })
    );
    expect(p.created).toBe("2026-09-15");
  });

  it("maps a Lesson Log page to a LessonRow", async () => {
    const { mapLessonPage } = await import("@/lib/players");
    const row = mapLessonPage({
      id: "lesson-1",
      properties: {
        Session: { type: "title", title: [{ plain_text: "Lesson — Test Player — Tue" }] },
        Client: { relation: [{ id: "client-1" }] },
        Date: { date: { start: "2026-09-30T17:00:00.000-04:00" } },
        Location: { select: { name: "Olney Mill" } },
        Duration: { select: { name: "1hr" } },
        "Amount (cents)": { number: 5000 },
      },
    });
    expect(row).toMatchObject({
      id: "lesson-1",
      playerId: "client-1",
      title: "Lesson — Test Player — Tue",
      date: "2026-09-30T17:00:00.000-04:00",
      location: "Olney Mill",
      durationMin: 60,
      amountCents: 5000,
    });
  });

  it("maps duration labels to minutes and unknown labels to 0", async () => {
    const { durationLabelToMinutes } = await import("@/lib/players");
    expect(durationLabelToMinutes("30min")).toBe(30);
    expect(durationLabelToMinutes("1hr")).toBe(60);
    expect(durationLabelToMinutes("1.5hr")).toBe(90);
    expect(durationLabelToMinutes("2hr")).toBe(120);
    expect(durationLabelToMinutes("")).toBe(0);
    expect(durationLabelToMinutes("3hr")).toBe(0);
  });
});

describe("lib/coaching-crm helpers", () => {
  it("maps minutes to Duration select labels", async () => {
    const { minutesToDurationLabel } = await import("@/lib/coaching-crm");
    expect(minutesToDurationLabel(30)).toBe("30min");
    expect(minutesToDurationLabel(45)).toBe("1hr");
    expect(minutesToDurationLabel(60)).toBe("1hr");
    expect(minutesToDurationLabel(90)).toBe("1.5hr");
    expect(minutesToDurationLabel(120)).toBe("2hr");
    expect(minutesToDurationLabel(180)).toBe("2hr");
  });
});
