"use client";

import { useEffect } from "react";
import { captureUtm } from "@/lib/funnelClient";

/**
 * One-shot UTM capture. Reads utm_source/utm_campaign/utm_medium/ref from
 * the URL on first landing, stashes in sessionStorage, and strips them from
 * the URL bar. Idempotent — safe to mount unconditionally.
 */
export function UtmCapture() {
  useEffect(() => {
    try {
      captureUtm();
    } catch {
      /* analytics must never break the page */
    }
  }, []);

  return null;
}
