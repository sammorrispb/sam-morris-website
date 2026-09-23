import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const notionPagesRetrieve = vi.fn();
const notionPagesUpdate = vi.fn();
const notionDataSourcesQuery = vi.fn();
const sendEmailMock = vi.fn();

vi.mock("@notionhq/client", () => ({
  Client: class {
    pages = { retrieve: notionPagesRetrieve, update: notionPagesUpdate };
    dataSources = { query: notionDataSourcesQuery };
  },
}));
vi.mock("@/lib/email", () => ({
  sendEmail: sendEmailMock,
}));

process.env.ADMIN_PASSWORD = "test-admin-password";
process.env.NOTION_API_KEY = "test-notion-key";
process.env.NOTION_LEADS_DB_ID = "db_leads";

function futureDate(days: number): string {
  return new Date(Date.now() + days * 86400000).toISOString().slice(0, 10);
}

function makeProposeRequest(token: string | null, body: unknown) {
  const headers = new Headers({ "content-type": "application/json" });
  if (token !== null) headers.set("Authorization", `Bearer ${token}`);
  return new Request("https://www.sammorrispb.com/api/admin/lessons/propose", {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
}

function makeConfirmRequest(body: unknown) {
  return new Request("https://www.sammorrispb.com/api/lessons/confirm", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

function leadPage(overrides: Record<string, unknown> = {}) {
  const props: Record<string, unknown> = {
    Name: { type: "title", title: [{ plain_text: "Alex Rivera" }] },
    Email: { type: "email", email: "alex@example.com" },
    Interest: { type: "select", select: { name: "Private Lesson" } },
    "Confirm Token": { type: "rich_text", rich_text: [{ plain_text: "tok123" }] },
    Status: { type: "select", select: { name: "Awaiting player" } },
    "Confirm By": {
      type: "date",
      date: { start: new Date(Date.now() + 86400000).toISOString() },
    },
    "Lesson Date": {
      type: "date",
      date: { start: `${futureDate(30)}T18:00:00-04:00` },
    },
    "Lesson Location": {
      type: "rich_text",
      rich_text: [{ plain_text: "Walter Johnson HS" }],
    },
    "Lesson Duration (min)": { type: "number", number: 60 },
    "Additional Players": { type: "rich_text", rich_text: [] },
    ...overrides,
  };
  return { object: "page", id: "page_1", properties: props };
}

beforeEach(() => {
  vi.resetAllMocks();
  notionPagesRetrieve.mockResolvedValue(leadPage());
  notionPagesUpdate.mockResolvedValue({});
  notionDataSourcesQuery.mockResolvedValue({ results: [] });
  sendEmailMock.mockResolvedValue({ success: true });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("lib/lessons", () => {
  it("generates unique 64-char hex tokens", async () => {
    const { generateConfirmToken } = await import("@/lib/lessons");
    const a = generateConfirmToken();
    const b = generateConfirmToken();
    expect(a).toMatch(/^[0-9a-f]{64}$/);
    expect(a).not.toBe(b);
  });

  it("builds the confirm URL", async () => {
    const { buildConfirmUrl } = await import("@/lib/lessons");
    expect(buildConfirmUrl("abc")).toBe(
      "https://www.sammorrispb.com/lessons/confirm?token=abc"
    );
  });

  it("titles lessons per interest", async () => {
    const { lessonTitle } = await import("@/lib/lessons");
    expect(lessonTitle("Private Lesson", ["Alex Rivera"])).toBe(
      "Private lesson with Coach Sam and Alex Rivera"
    );
    expect(lessonTitle("Group Lesson (2+)", ["Alex Rivera", "Jordan Lee"])).toBe(
      "Group lesson with Coach Sam and Alex Rivera, Jordan Lee"
    );
    expect(lessonTitle("3+1 Play-In Special", ["Alex"])).toBe(
      "3+1 Play-In with Coach Sam and Alex"
    );
    expect(lessonTitle("Private Lesson", [])).toBe(
      "Private lesson with Coach Sam"
    );
  });

  it("prices lessons at the hourly rate prorated by duration", async () => {
    const { lessonAmountCents, formatAmountDollars } = await import(
      "@/lib/lessons"
    );
    expect(lessonAmountCents(60)).toBe(5000);
    expect(lessonAmountCents(120)).toBe(10000);
    expect(lessonAmountCents(30)).toBe(2500);
    expect(formatAmountDollars(5000)).toBe("$50");
    expect(formatAmountDollars(2550)).toBe("$25.50");
  });

  it("formats lesson datetimes in ET", async () => {
    const { formatLessonDateTime, etDateTimeIso, lessonEndIso } = await import(
      "@/lib/lessons"
    );
    expect(formatLessonDateTime("2026-09-29T18:00:00-04:00")).toBe(
      "Tue, Sep 29 at 6:00 PM ET"
    );
    expect(etDateTimeIso("2026-09-29", "18:00")).toBe(
      "2026-09-29T18:00:00-04:00"
    );
    expect(etDateTimeIso("2026-01-15", "10:00")).toBe(
      "2026-01-15T10:00:00-05:00"
    );
    expect(lessonEndIso("2026-09-29T18:00:00-04:00", 60)).toBe(
      "2026-09-29T23:00:00.000Z"
    );
  });
});

describe("POST /api/admin/lessons/propose", () => {
  const validBody = () => ({
    pageId: "page_1",
    date: futureDate(30),
    time: "18:00",
    location: "Walter Johnson HS Tennis Courts",
    durationMin: 60,
    additionalPlayers: "Jordan Lee",
  });

  it("returns 401 without auth", async () => {
    const { POST } = await import("@/app/api/admin/lessons/propose/route");
    const res = await POST(makeProposeRequest(null, validBody()));
    expect(res.status).toBe(401);
    expect(notionPagesRetrieve).not.toHaveBeenCalled();
  });

  it("rejects bad date/time formats", async () => {
    const { POST } = await import("@/app/api/admin/lessons/propose/route");
    const res = await POST(
      makeProposeRequest("test-admin-password", {
        ...validBody(),
        date: "09/29/2026",
      })
    );
    expect(res.status).toBe(400);
  });

  it("rejects lessons in the past", async () => {
    const { POST } = await import("@/app/api/admin/lessons/propose/route");
    const res = await POST(
      makeProposeRequest("test-admin-password", {
        ...validBody(),
        date: "2020-01-01",
        time: "10:00",
      })
    );
    expect(res.status).toBe(400);
  });

  it("rejects non-lesson interests", async () => {
    notionPagesRetrieve.mockResolvedValue(
      leadPage({
        Interest: { type: "select", select: { name: "Youth Programs" } },
      })
    );
    const { POST } = await import("@/app/api/admin/lessons/propose/route");
    const res = await POST(
      makeProposeRequest("test-admin-password", validBody())
    );
    expect(res.status).toBe(400);
    expect(sendEmailMock).not.toHaveBeenCalled();
  });

  it("rejects leads with no email", async () => {
    notionPagesRetrieve.mockResolvedValue(
      leadPage({ Email: { type: "email", email: "" } })
    );
    const { POST } = await import("@/app/api/admin/lessons/propose/route");
    const res = await POST(
      makeProposeRequest("test-admin-password", validBody())
    );
    expect(res.status).toBe(400);
  });

  it("saves the proposal, flips status, and emails the confirm link", async () => {
    const { POST } = await import("@/app/api/admin/lessons/propose/route");
    const res = await POST(
      makeProposeRequest("test-admin-password", validBody())
    );
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.confirmUrl).toMatch(
      /^https:\/\/www\.sammorrispb\.com\/lessons\/confirm\?token=[0-9a-f]{64}$/
    );

    expect(notionPagesUpdate).toHaveBeenCalledTimes(1);
    const updateArg = notionPagesUpdate.mock.calls[0][0];
    expect(updateArg.page_id).toBe("page_1");
    expect(updateArg.properties.Status).toEqual({
      select: { name: "Awaiting player" },
    });
    expect(updateArg.properties["Lesson Location"].rich_text[0].text.content).toBe(
      "Walter Johnson HS Tennis Courts"
    );
    expect(updateArg.properties["Lesson Duration (min)"].number).toBe(60);
    expect(
      updateArg.properties["Additional Players"].rich_text[0].text.content
    ).toBe("Jordan Lee");
    expect(
      updateArg.properties["Confirm Token"].rich_text[0].text.content
    ).toMatch(/^[0-9a-f]{64}$/);
    expect(updateArg.properties["Invoice Sent"].checkbox).toBe(false);

    expect(sendEmailMock).toHaveBeenCalledTimes(1);
    const [to, subject, body] = sendEmailMock.mock.calls[0];
    expect(to).toBe("alex@example.com");
    expect(subject).toContain("Confirm your lesson");
    expect(body).toContain(data.confirmUrl);
    expect(body).toContain("Private lesson with Coach Sam and Alex Rivera, Jordan Lee");
  });

  it("returns 502 when the email fails after saving", async () => {
    sendEmailMock.mockResolvedValue({ success: false, error: "smtp down" });
    const { POST } = await import("@/app/api/admin/lessons/propose/route");
    const res = await POST(
      makeProposeRequest("test-admin-password", validBody())
    );
    expect(res.status).toBe(502);
    expect(notionPagesUpdate).toHaveBeenCalledTimes(1);
  });
});

describe("POST /api/lessons/confirm", () => {
  it("returns 400 without a token", async () => {
    const { POST } = await import("@/app/api/lessons/confirm/route");
    const res = await POST(makeConfirmRequest({}));
    expect(res.status).toBe(400);
  });

  it("returns 404 for an unknown or used token", async () => {
    const { POST } = await import("@/app/api/lessons/confirm/route");
    const res = await POST(makeConfirmRequest({ token: "nope" }));
    expect(res.status).toBe(404);
    expect(notionPagesUpdate).not.toHaveBeenCalled();
  });

  it("returns 410 for an expired link", async () => {
    notionDataSourcesQuery.mockResolvedValue({
      results: [
        leadPage({
          "Confirm By": {
            type: "date",
            date: { start: new Date(Date.now() - 86400000).toISOString() },
          },
        }),
      ],
    });
    const { POST } = await import("@/app/api/lessons/confirm/route");
    const res = await POST(makeConfirmRequest({ token: "tok123" }));
    expect(res.status).toBe(410);
    expect(notionPagesUpdate).not.toHaveBeenCalled();
  });

  it("returns 410 when the lesson time has passed", async () => {
    notionDataSourcesQuery.mockResolvedValue({
      results: [
        leadPage({
          "Lesson Date": {
            type: "date",
            date: { start: "2020-01-01T10:00:00-05:00" },
          },
        }),
      ],
    });
    const { POST } = await import("@/app/api/lessons/confirm/route");
    const res = await POST(makeConfirmRequest({ token: "tok123" }));
    expect(res.status).toBe(410);
    expect(notionPagesUpdate).not.toHaveBeenCalled();
  });

  it("confirms the lesson, flips status, and clears the token", async () => {
    notionDataSourcesQuery.mockResolvedValue({ results: [leadPage()] });
    const { POST } = await import("@/app/api/lessons/confirm/route");
    const res = await POST(makeConfirmRequest({ token: "tok123" }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });

    expect(notionPagesUpdate).toHaveBeenCalledTimes(1);
    const updateArg = notionPagesUpdate.mock.calls[0][0];
    expect(updateArg.page_id).toBe("page_1");
    expect(updateArg.properties.Status).toEqual({
      select: { name: "Confirmed" },
    });
    expect(updateArg.properties["Confirm Token"]).toEqual({ rich_text: [] });
  });
});
