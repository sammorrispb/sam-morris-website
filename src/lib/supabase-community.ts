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
