import { Client } from "@notionhq/client";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getDataSourceId } from "@/lib/notion";
import { mapClientPage, mapLessonPage } from "@/lib/players";

export const dynamic = "force-dynamic";

function validateAuth(request: Request): boolean {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  return Boolean(token) && token === process.env.ADMIN_PASSWORD;
}

function getNotionConfig() {
  const apiKey = process.env.NOTION_API_KEY?.trim();
  const dbId = process.env.NOTION_COACHING_CLIENTS_DB_ID?.trim();
  if (!apiKey || !dbId) return null;
  return { apiKey, dbId };
}

function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) return null;
  return new Stripe(key, { apiVersion: "2026-02-25.clover" });
}

/**
 * GET /api/admin/players/[id] — one player with lesson history and payments.
 * Lessons come from the Lessons DB when NOTION_LESSONS_DB_ID is configured;
 * invoices are read live from Stripe by customer email so there is nothing
 * to keep in sync.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!validateAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const config = getNotionConfig();
  if (!config) {
    return NextResponse.json(
      { error: "Players CRM not configured" },
      { status: 500 }
    );
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  try {
    const notion = new Client({ auth: config.apiKey });

    let page;
    try {
      page = await notion.pages.retrieve({ page_id: id });
    } catch {
      return NextResponse.json({ error: "Player not found" }, { status: 404 });
    }
    if (page.object !== "page" || !("properties" in page)) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 });
    }
    const player = mapClientPage(page);

    // --- Lesson history (optional Lessons DB) ---
    const lessonsDbId = process.env.NOTION_LESSONS_DB_ID?.trim();
    let lessons: ReturnType<typeof mapLessonPage>[] = [];
    if (lessonsDbId) {
      try {
        const lessonsDsId = await getDataSourceId(notion, lessonsDbId);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res: any = await notion.dataSources.query({
          data_source_id: lessonsDsId,
          filter: { property: "Player", relation: { contains: id } },
          sorts: [{ property: "Date", direction: "descending" }],
          page_size: 100,
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        lessons = (res.results ?? []).map((p: any) => mapLessonPage(p));
      } catch (err) {
        console.error("Player detail: lessons query failed", err);
      }
    }

    // --- Payments, live from Stripe by customer email ---
    const stripe = getStripe();
    let invoices: {
      id: string;
      number: string;
      created: number;
      amountCents: number;
      status: string;
      hostedUrl: string;
      description: string;
    }[] = [];
    if (stripe && player.email) {
      try {
        const customers = await stripe.customers.list({
          email: player.email,
          limit: 1,
        });
        const customer = customers.data[0];
        if (customer) {
          const invList = await stripe.invoices.list({
            customer: customer.id,
            limit: 25,
          });
          invoices = invList.data.map((inv) => ({
            id: inv.id,
            number: inv.number ?? "",
            created: inv.created,
            amountCents: inv.amount_due,
            status: inv.status ?? "",
            hostedUrl: inv.hosted_invoice_url ?? "",
            description: inv.description ?? inv.lines?.data?.[0]?.description ?? "",
          }));
          invoices.sort((a, b) => b.created - a.created);
        }
      } catch (err) {
        console.error("Player detail: Stripe lookup failed", err);
      }
    }

    return NextResponse.json({
      player,
      lessons,
      lessonsConfigured: Boolean(lessonsDbId),
      invoices,
      stripeConfigured: Boolean(stripe),
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("Admin player detail error:", msg);
    return NextResponse.json(
      { error: `Failed to fetch player: ${msg}` },
      { status: 500 }
    );
  }
}
