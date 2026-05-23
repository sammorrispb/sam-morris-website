/**
 * Supabase client for the community-os tqqh project. Used for cross-app
 * writes to L&D's shared schema (e.g. inserting cohort signup waivers into
 * `public.waivers`). One-way coupling: sammorrispb writes, never reads.
 *
 * Uses the service-role key on purpose — this is a server-side write from
 * one project's lambda to another project's database. The key never reaches
 * the client bundle. We tried the anon-key route (waivers table has a
 * `for insert to anon` policy with `check (true)`) but the JWT was rejected
 * by RLS on this project despite carrying `role: anon`. Service-role bypasses
 * RLS and works reliably; security is enforced server-side by validating the
 * form input in the cohort signup action before insert.
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
