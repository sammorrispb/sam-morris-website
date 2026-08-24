import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const notionPagesCreate = vi.fn();
const notionPagesUpdate = vi.fn();
const sendEmailMock = vi.fn();
const notifySamMock = vi.fn();
const generateEmailDraftMock = vi.fn(() => "draft body");
const ingestToOpenBrainMock = vi.fn();

vi.mock("@notionhq/client", () => ({
  Client: class {
    pages = { create: notionPagesCreate, update: notionPagesUpdate };
  },
}));
vi.mock("@/lib/email", () => ({
  sendEmail: sendEmailMock,
  notifySam: notifySamMock,
}));
vi.mock("@/lib/emailTemplates", () => ({
  generateEmailDraft: generateEmailDraftMock,
}));
vi.mock("@/lib/open-brain-ingest", () => ({
  ingestToOpenBrain: ingestToOpenBrainMock,
}));

function makeRequest(body: unknown) {
  return new Request("https://www.sammorrispb.com/api/leads", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.resetAllMocks();
  notionPagesCreate.mockResolvedValue({ id: "page_1" });
  notionPagesUpdate.mockResolvedValue({});
  sendEmailMock.mockResolvedValue({ success: true });
  notifySamMock.mockResolvedValue(undefined);
  ingestToOpenBrainMock.mockResolvedValue(undefined);
  generateEmailDraftMock.mockReturnValue("draft body");
  process.env.NOTION_API_KEY = "secret_notion";
  process.env.NOTION_LEADS_DB_ID = "db_leads";
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("POST /api/leads", () => {
  it("rejects when required fields are missing", async () => {
    const { POST } = await import("@/app/api/leads/route");
    const res = await POST(makeRequest({ email: "x@y.z" }));
    expect(res.status).toBe(400);
    expect(notionPagesCreate).not.toHaveBeenCalled();
  });

  it("rejects malformed email", async () => {
    const { POST } = await import("@/app/api/leads/route");
    const res = await POST(
      makeRequest({ name: "A", email: "not-an-email", interest: "Coaching" }),
    );
    expect(res.status).toBe(400);
  });

  it("rejects Event/Clinic interest without event_type", async () => {
    const { POST } = await import("@/app/api/leads/route");
    const res = await POST(
      makeRequest({
        name: "A",
        email: "a@b.co",
        interest: "Event / Clinic",
      }),
    );
    expect(res.status).toBe(400);
  });

  it("when Notion env is unconfigured, succeeds without writing", async () => {
    delete process.env.NOTION_API_KEY;
    const { POST } = await import("@/app/api/leads/route");
    const res = await POST(
      makeRequest({ name: "A", email: "a@b.co", interest: "Coaching" }),
    );
    expect(res.status).toBe(200);
    expect(notionPagesCreate).not.toHaveBeenCalled();
    // Route short-circuits before OB ingest when Notion is unconfigured —
    // behavior to preserve so dev environments stay silent end-to-end.
    expect(ingestToOpenBrainMock).not.toHaveBeenCalled();
  });

  it("happy path: creates lead, draft, notifies, sends welcome, ingests to OB", async () => {
    process.env.NOTION_DRAFTS_DB_ID = "db_drafts";
    notionPagesCreate.mockResolvedValueOnce({ id: "lead_p1" });
    notionPagesCreate.mockResolvedValueOnce({ id: "draft_p1" });
    const { POST } = await import("@/app/api/leads/route");
    const res = await POST(
      makeRequest({
        name: "Alice",
        email: "alice@example.com",
        interest: "Coaching",
        notes: "  bring two paddles  ",
        utm: { utm_source: "gbp", utm_campaign: "spring" },
        page: "/programs/coaching",
      }),
    );
    expect(res.status).toBe(200);
    // 1 lead + 1 draft = 2 Notion page creates (drafts DB configured above)
    expect(notionPagesCreate).toHaveBeenCalledTimes(2);
    expect(notifySamMock).toHaveBeenCalledTimes(1);
    expect(sendEmailMock).toHaveBeenCalledWith(
      "alice@example.com",
      expect.stringContaining("Alice"),
      expect.any(String),
    );
    expect(ingestToOpenBrainMock).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "alice@example.com",
        business: "coaching",
        source: "sammorrispb_coaching",
        interest: "Coaching",
        utm: expect.objectContaining({ source: "gbp", campaign: "spring" }),
      }),
    );
  });

  it("maps utm_source to known Source vocab (gbp → GBP, fb → FB Group, unknown → Website)", async () => {
    const { POST } = await import("@/app/api/leads/route");
    await POST(
      makeRequest({
        name: "A",
        email: "a@b.co",
        interest: "Coaching",
        utm: { utm_source: "gbp" },
      }),
    );
    expect(notionPagesCreate.mock.calls[0][0].properties.Source.select.name).toBe(
      "GBP",
    );

    notionPagesCreate.mockClear();
    await POST(
      makeRequest({
        name: "B",
        email: "b@b.co",
        interest: "Coaching",
        utm: { utm_source: "fb" },
      }),
    );
    expect(notionPagesCreate.mock.calls[0][0].properties.Source.select.name).toBe(
      "FB Group",
    );

    notionPagesCreate.mockClear();
    await POST(
      makeRequest({
        name: "C",
        email: "c@b.co",
        interest: "Coaching",
        utm: { utm_source: "partner-acme" },
      }),
    );
    expect(notionPagesCreate.mock.calls[0][0].properties.Source.select.name).toBe(
      "Partner",
    );

    notionPagesCreate.mockClear();
    await POST(
      makeRequest({
        name: "D",
        email: "d@b.co",
        interest: "Coaching",
        utm: { utm_source: "bogus-source" },
      }),
    );
    expect(notionPagesCreate.mock.calls[0][0].properties.Source.select.name).toBe(
      "Website",
    );
  });

  it("sanitizes notes: trims, collapses whitespace, truncates to 1000 chars", async () => {
    const longNotes = "a".repeat(2000);
    const { POST } = await import("@/app/api/leads/route");
    await POST(
      makeRequest({
        name: "A",
        email: "a@b.co",
        interest: "Coaching",
        notes: longNotes,
      }),
    );
    // First create call = lead with children = body blocks including notes
    const leadCreate = notionPagesCreate.mock.calls[0][0];
    const notesBlock = leadCreate.children.find(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (b: any) =>
        b.type === "paragraph" && b.paragraph.rich_text[0].text.content.length > 100,
    );
    expect(notesBlock.paragraph.rich_text[0].text.content.length).toBe(1000);
  });

  it("relays preferred location to Notion body, Sam notification, and OB metadata", async () => {
    const { POST } = await import("@/app/api/leads/route");
    await POST(
      makeRequest({
        name: "A",
        email: "a@b.co",
        interest: "Private Lesson",
        location: "The Pickl Park — Frederick, MD",
      }),
    );
    const leadCreate = notionPagesCreate.mock.calls[0][0];
    const headings = leadCreate.children
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .filter((b: any) => b.type === "heading_3")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((b: any) => b.heading_3.rich_text[0].text.content);
    expect(headings).toContain("Preferred Location");
    const locationBlock = leadCreate.children.find(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (b: any) =>
        b.type === "paragraph" &&
        b.paragraph.rich_text[0].text.content === "The Pickl Park — Frederick, MD",
    );
    expect(locationBlock).toBeTruthy();
    expect(notifySamMock).toHaveBeenCalledWith(
      expect.any(String),
      expect.stringContaining("Preferred Location: The Pickl Park — Frederick, MD"),
    );
    expect(ingestToOpenBrainMock).toHaveBeenCalledWith(
      expect.objectContaining({
        metadata: expect.objectContaining({
          location: "The Pickl Park — Frederick, MD",
        }),
      }),
    );
  });

  it("omits location everywhere when not provided", async () => {
    const { POST } = await import("@/app/api/leads/route");
    await POST(
      makeRequest({ name: "A", email: "a@b.co", interest: "Private Lesson" }),
    );
    const leadCreate = notionPagesCreate.mock.calls[0][0];
    const headings = (leadCreate.children ?? [])
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .filter((b: any) => b.type === "heading_3")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((b: any) => b.heading_3.rich_text[0].text.content);
    expect(headings).not.toContain("Preferred Location");
    expect(notifySamMock.mock.calls[0][1]).not.toContain("Preferred Location");
    const obMetadata = ingestToOpenBrainMock.mock.calls[0][0].metadata;
    expect(obMetadata).not.toHaveProperty("location");
  });

  it("Business Partnerships interest auto-opts-out of drip", async () => {
    const { POST } = await import("@/app/api/leads/route");
    await POST(
      makeRequest({
        name: "Biz",
        email: "biz@example.com",
        interest: "Business Partnerships",
      }),
    );
    expect(
      notionPagesCreate.mock.calls[0][0].properties["Drip Opted Out"].checkbox,
    ).toBe(true);
  });
});
