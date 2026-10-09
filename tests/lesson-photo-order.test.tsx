import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { queryLeads } from "@/lib/notion";
import ConfirmLessonPage from "@/app/lessons/confirm/page";

vi.mock("@/lib/notion", () => ({ queryLeads: vi.fn() }));
vi.mock("@notionhq/client", () => ({ Client: class {} }));
vi.stubGlobal("React", React);

beforeEach(() => {
  vi.stubEnv("NOTION_API_KEY", "synthetic-test-value");
  vi.stubEnv("NOTION_LEADS_DB_ID", "synthetic-test-database");
  vi.clearAllMocks();
});
afterEach(() => vi.unstubAllEnvs());

const row = (confirmBy: string, start: string) => ({ results: [{properties: {
  "Confirm By": {date: {start: confirmBy}}, "Lesson Date": {date: {start}},
  Name: {type: "title", title: [{plain_text: "Test player"}]},
  Interest: {type: "rich_text", rich_text: [{plain_text: "Private lesson"}]},
  "Lesson Location": {type: "rich_text", rich_text: [{plain_text: "Test court"}]},
  "Lesson Duration (min)": {number: 60},
}}] });

describe("lesson photo preserves proposal state", () => {
  it("follows the actual proposal and both controls on a valid link", async () => {
    vi.mocked(queryLeads).mockResolvedValue(row("2080-01-01T00:00:00Z", "2080-01-02T18:00:00Z"));
    const html = renderToStaticMarkup(await ConfirmLessonPage({searchParams: Promise.resolve({token: "synthetic-private-token"})}));
    expect(html).toContain('data-page-photo="/lessons/confirm"');
    expect(html.indexOf("Test court")).toBeLessThan(html.indexOf("data-page-photo="));
    expect(html.indexOf("</form>")).toBeLessThan(html.indexOf("data-page-photo="));
    expect(html).not.toContain('data-page-photo="synthetic-private-token"');
  });
  it.each([
    [row("2000-01-01T00:00:00Z", "2080-01-02T18:00:00Z"), "Link expired"],
    [row("2080-01-01T00:00:00Z", "2000-01-02T18:00:00Z"), "Time has passed"],
    [{results: []}, "Link not found"],
  ])("omits photos from invalid, expired, or past proposals", async (response, heading) => {
    vi.mocked(queryLeads).mockResolvedValue(response);
    const html = renderToStaticMarkup(await ConfirmLessonPage({searchParams: Promise.resolve({token: "synthetic-private-token"})}));
    expect(html).toContain(heading);
    expect(html).not.toContain("data-page-photo=");
  });
});
