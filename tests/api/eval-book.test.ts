import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const sendEmailMock = vi.fn();
const notifySamMock = vi.fn();
const generateEmailDraftMock = vi.fn(() => "eval draft");
const ingestToOpenBrainMock = vi.fn();

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
  return new Request("https://www.sammorrispb.com/api/eval-book", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.resetAllMocks();
  sendEmailMock.mockResolvedValue({ success: true });
  notifySamMock.mockResolvedValue(undefined);
  ingestToOpenBrainMock.mockResolvedValue(undefined);
  generateEmailDraftMock.mockReturnValue("eval draft");
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("POST /api/eval-book", () => {
  it("rejects missing name", async () => {
    const { POST } = await import("@/app/api/eval-book/route");
    const res = await POST(makeRequest({ email: "a@b.co" }));
    expect(res.status).toBe(400);
    expect(ingestToOpenBrainMock).not.toHaveBeenCalled();
  });

  it("rejects missing email", async () => {
    const { POST } = await import("@/app/api/eval-book/route");
    const res = await POST(makeRequest({ name: "A" }));
    expect(res.status).toBe(400);
  });

  it("rejects malformed email", async () => {
    const { POST } = await import("@/app/api/eval-book/route");
    const res = await POST(makeRequest({ name: "A", email: "not-an-email" }));
    expect(res.status).toBe(400);
  });

  it("returns 500 on non-JSON body", async () => {
    const { POST } = await import("@/app/api/eval-book/route");
    const res = await POST(makeRequest("not json"));
    expect(res.status).toBe(500);
  });

  it("happy path: lowercases email, sends welcome, notifies, ingests to OB", async () => {
    const { POST } = await import("@/app/api/eval-book/route");
    const res = await POST(
      makeRequest({
        name: "Alice",
        email: "Alice@Example.COM",
        utm_campaign: "spring",
        utm: { utm_source: "meta_ad", utm_medium: "paid_social" },
        page: "/evaluation",
      }),
    );
    expect(res.status).toBe(200);
    expect(sendEmailMock).toHaveBeenCalledWith(
      "alice@example.com",
      expect.stringContaining("evaluation"),
      expect.any(String),
    );
    expect(notifySamMock).toHaveBeenCalledTimes(1);
    expect(ingestToOpenBrainMock).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "alice@example.com",
        business: "coaching",
        source: "sammorrispb_eval_book",
        interest: "Free Evaluation",
      }),
    );
  });

  it("downstream email failures do not block the 200 response", async () => {
    sendEmailMock.mockRejectedValueOnce(new Error("smtp down"));
    notifySamMock.mockRejectedValueOnce(new Error("smtp down"));
    const { POST } = await import("@/app/api/eval-book/route");
    const res = await POST(makeRequest({ name: "B", email: "b@b.co" }));
    expect(res.status).toBe(200);
    expect(ingestToOpenBrainMock).toHaveBeenCalled();
  });
});
