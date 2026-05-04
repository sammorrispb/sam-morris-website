"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/funnelClient";

const SKIP_PREFIXES = ["/api", "/og", "/admin"];

function shouldSkip(pathname: string | null): boolean {
  if (!pathname) return true;
  return SKIP_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

/**
 * Fires a `page_view` event on every route change. Mounted once at the root
 * so the initial mount + subsequent App Router transitions both fire exactly
 * once each (the lastFired ref + ~50ms debounce avoids React StrictMode
 * double-invocation in dev).
 */
export function PageViewTracker() {
  const pathname = usePathname();
  const lastFired = useRef<string | null>(null);

  useEffect(() => {
    if (shouldSkip(pathname)) return;
    if (pathname === lastFired.current) return;

    const id = window.setTimeout(() => {
      // Re-check inside the timeout so a rapid pathname flip doesn't
      // double-fire — only fire if the path is still current.
      if (pathname === lastFired.current) return;
      lastFired.current = pathname;
      try {
        trackEvent("page_view", {
          referrer: typeof document !== "undefined" ? document.referrer : "",
        });
      } catch {
        /* analytics must never break the page */
      }
    }, 50);

    return () => window.clearTimeout(id);
  }, [pathname]);

  return null;
}
