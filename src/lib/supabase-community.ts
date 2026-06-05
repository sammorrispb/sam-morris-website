/**
 * Supabase client for the community-os hivux project (Phase 5 storage
 * unification, 2026-06-01: L&D's consumer tables moved tqqh public.* →
 * hivux `ld.*`). Used for cross-app writes to L&D's shared schema (e.g.
 * inserting cohort signup waivers into `ld.waivers` — same table P3 uses).
 * One-way coupling: sammorrispb writes, never reads.
 *
 * Uses the service-role key on purpose — this is a server-side write from
 * one project's lambda to another project's database. The key never reaches
 * the client bundle. Service-role bypasses RLS; security is enforced
 * server-side by validating the form input in the cohort signup action
 * before insert.
 *
 * Returns null if env is unset — callers must handle that path and fall back
 * to lead capture without waiver persistence (logged as a hard error).
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

export function getCommunityClient(): SupabaseClient | null {
  if (cached) return cached;

  const url = process.env.SUPABASE_COMMUNITY_URL?.trim();
  const serviceKey = process.env.SUPABASE_COMMUNITY_SERVICE_KEY?.trim();

  if (!url || !serviceKey) {
    console.error("[supabase-community] SUPABASE_COMMUNITY_URL or SUPABASE_COMMUNITY_SERVICE_KEY is missing");
    return null;
  }

  cached = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    // L&D consumer tables live in the `ld` schema on hivux (not `public`,
    // which belongs to coach-os on this project). Cast is sound — `ld` is a
    // 1:1 copy of the former tqqh `public` shape.
    db: { schema: "ld" as "public" },
  });

  return cached;
}

/**
 * Service-role client scoped to the platform `community` schema (the L&D
 * identity spine: community.players + identity_links + the resolver RPCs).
 * Distinct from getCommunityClient() above, which is `ld`-scoped for waivers.
 * Returns null if env is unset — callers fail open.
 */
let cachedCommunitySchema: SupabaseClient | null = null;

export function getCommunitySchemaClient(): SupabaseClient | null {
  if (cachedCommunitySchema) return cachedCommunitySchema;

  const url = process.env.SUPABASE_COMMUNITY_URL?.trim();
  const serviceKey = process.env.SUPABASE_COMMUNITY_SERVICE_KEY?.trim();

  if (!url || !serviceKey) {
    console.error(
      "[supabase-community] SUPABASE_COMMUNITY_URL or SUPABASE_COMMUNITY_SERVICE_KEY is missing"
    );
    return null;
  }

  cachedCommunitySchema = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    db: { schema: "community" as "public" },
  });

  return cachedCommunitySchema;
}

/**
 * Upsert a person into the L&D community identity spine and return their
 * canonical community.players id. Keyed on normalized email/phone via the
 * existing resolver RPCs (community.resolve_or_create_player[_dual]) — so a
 * Coach Sam lesson buyer who is also a p3 player / newsletter subscriber folds
 * into ONE profile instead of creating a duplicate.
 *
 * Fail-open: returns { ok: false } on any problem; the caller (Stripe webhook)
 * must never let a spine-write failure block the receipt/CRM/email path.
 */
export async function upsertCommunityPlayer(input: {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  raw?: Record<string, unknown> | null;
}): Promise<{ ok: true; playerId: string } | { ok: false; error: string }> {
  const client = getCommunitySchemaClient();
  if (!client) return { ok: false, error: "community schema client not configured" };

  const name = input.name?.trim() || null;
  const email = input.email?.trim().toLowerCase() || null;
  const phone = input.phone?.trim() || null;
  if (!email && !phone) return { ok: false, error: "no email or phone to resolve" };

  // Paid Stripe checkout → reasonably trusted identity. Not marked `verified`
  // (we didn't independently confirm ownership), but above the default floor.
  const confidence = 70;
  const raw = input.raw ?? null;

  try {
    const { data, error } =
      email && phone
        ? await client.rpc("resolve_or_create_player_dual", {
            p_primary_source: "email",
            p_primary_value: email,
            p_secondary_source: "phone",
            p_secondary_value: phone,
            p_display_name: name,
            p_confidence: confidence,
            p_raw: raw,
            p_verified: false,
          })
        : await client.rpc("resolve_or_create_player", {
            p_source: email ? "email" : "phone",
            p_value: email ?? phone,
            p_display_name: name,
            p_confidence: confidence,
            p_raw: raw,
            p_verified: false,
          });

    if (error) {
      console.error("[supabase-community] resolve_or_create_player failed", error);
      return { ok: false, error: error.message };
    }
    return { ok: true, playerId: data as string };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[supabase-community] resolve_or_create_player threw", msg);
    return { ok: false, error: msg };
  }
}

export type CohortWaiverInsert = {
  full_name: string;
  email: string;
  phone: string;
  dob: string; // ISO date (YYYY-MM-DD)
  is_minor: boolean;
  parent_name: string | null;
  parent_email: string | null;
  parent_phone: string | null;
  liability_consent: boolean;
  media_consent: boolean;
  sms_consent: boolean;
  sms_consent_text: string | null;
  ip_address: string | null;
  user_agent: string | null;
  event_context: string;
  season: string;
};

export async function insertCohortWaiver(
  row: CohortWaiverInsert
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const client = getCommunityClient();
  if (!client) return { ok: false, error: "Supabase community client not configured" };

  const { data, error } = await client
    .from("waivers")
    .insert(row)
    .select("id")
    .single();

  if (error) {
    console.error("[supabase-community] waiver insert failed", error);
    return { ok: false, error: error.message };
  }

  return { ok: true, id: data.id as string };
}
