import { timingSafeEqual } from "crypto";
import { Client } from "@notionhq/client";
import { unsubscribeSig } from "@/lib/drip";

export const dynamic = "force-dynamic";

function htmlResponse(title: string, message: string, status: number): Response {
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${title} — Sam Morris Pickleball</title>
<style>
  body { margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center;
         background: #0F0E0C; color: #F4ECE0; font-family: system-ui, -apple-system, sans-serif; }
  main { max-width: 28rem; padding: 2rem; text-align: center; }
  h1 { font-size: 1.5rem; margin-bottom: 0.75rem; }
  p { color: #A89F8E; line-height: 1.6; }
  a { color: #E8A03A; }
</style>
</head>
<body>
<main>
  <h1>${title}</h1>
  <p>${message}</p>
</main>
</body>
</html>`;
  return new Response(html, {
    status,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  const sig = url.searchParams.get("sig");

  // Bad or missing signature → 400, and never touch Notion.
  if (!id || !sig) {
    return htmlResponse("Invalid link", "This unsubscribe link is missing information. If you want to stop follow-ups, just reply to the email and I'll take care of it.", 400);
  }

  let valid = false;
  try {
    const expected = Buffer.from(unsubscribeSig(id), "hex");
    const provided = Buffer.from(sig, "hex");
    valid = expected.length === provided.length && timingSafeEqual(expected, provided);
  } catch {
    valid = false;
  }

  if (!valid) {
    return htmlResponse("Invalid link", "This unsubscribe link isn't valid. If you want to stop follow-ups, just reply to the email and I'll take care of it.", 400);
  }

  const apiKey = process.env.NOTION_API_KEY?.trim();
  if (!apiKey) {
    return htmlResponse("Something went wrong", "Couldn't process your request right now. Reply to the email and I'll stop the follow-ups manually.", 500);
  }

  try {
    const notion = new Client({ auth: apiKey });
    await notion.pages.update({
      page_id: id,
      properties: {
        "Drip Opted Out": { checkbox: true },
      },
    });
    return htmlResponse(
      "You're all set",
      "No more follow-up emails from me. If you ever want to get back on court, sammorrispb.com is always open.",
      200,
    );
  } catch (error) {
    console.error("Drip unsubscribe error:", error instanceof Error ? error.message : error);
    return htmlResponse("Something went wrong", "Couldn't process your request right now. Reply to the email and I'll stop the follow-ups manually.", 500);
  }
}
