/**
 * Supabase client for the community-os tqqh project. Used for cross-app
 * writes to L&D's shared schema (e.g. inserting cohort signup waivers into
 * `public.waivers`). One-way coupling: sammorrispb writes, never reads.
 *
 * The waivers table has an RLS policy `waivers_insert_public` that allows
 * INSERT for anon + authenticated roles, so the anon key is sufficient.
 *
 * Returns null if env is unset — callers must handle that path and fall back
 * to lead capture without waiver persistence (logged as a hard error).
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

export function getCommunityClient(): SupabaseClient | null {
  if (cached) return cached;

  const url = process.env.SUPABASE_COMMUNITY_URL?.trim();
  const anonKey = process.env.SUPABASE_COMMUNITY_ANON_KEY?.trim();

  if (!url || !anonKey) {
    console.error("[supabase-community] SUPABASE_COMMUNITY_URL or SUPABASE_COMMUNITY_ANON_KEY is missing");
    return null;
  }

  cached = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
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
