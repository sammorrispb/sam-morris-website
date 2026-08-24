"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { ANNOUNCEMENT } from "@/lib/constants";

// Read localStorage safely across SSR + CSR with useSyncExternalStore.
function useDismissedFromStorage(id: string | undefined): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const handler = () => onChange();
      window.addEventListener("storage", handler);
      return () => window.removeEventListener("storage", handler);
    },
    () => {
      if (!id) return true;
      return localStorage.getItem(`dismissed-announcement-${id}`) !== null;
    },
    // Server render the banner so it occupies real layout space from first
    // paint. Visitors who already dismissed it never see it: the pre-paint
    // script in layout.tsx drops <html data-announcement>, and globals.css
    // hides .announcement-banner without it.
    () => false,
  );
}

export function AnnouncementBanner() {
  const persistedDismissed = useDismissedFromStorage(ANNOUNCEMENT?.id);
  const [locallyDismissed, setLocallyDismissed] = useState(false);
  const dismissed = persistedDismissed || locallyDismissed;

  if (!ANNOUNCEMENT || dismissed) return null;

  function handleDismiss() {
    localStorage.setItem(`dismissed-announcement-${ANNOUNCEMENT!.id}`, "1");
    // Hand the hero back its bleed-under-nav offset (see .hero-nav-offset).
    document.documentElement.removeAttribute("data-announcement");
    setLocallyDismissed(true);
  }

  return (
    <div className="announcement-banner relative bg-gradient-to-r from-accent-purple via-accent-blue to-accent-purple text-navy px-4 sm:px-6 py-2.5 flex items-start sm:items-center justify-center gap-2 sm:gap-3 text-[13px] sm:text-sm font-medium">
      <p className="text-center text-pretty leading-snug max-w-3xl">
        {ANNOUNCEMENT.message}
        {ANNOUNCEMENT.href && ANNOUNCEMENT.linkText && (
          <>
            {" "}
            <Link
              href={ANNOUNCEMENT.href}
              className="underline underline-offset-2 font-bold hover:opacity-80"
            >
              {ANNOUNCEMENT.linkText} &rarr;
            </Link>
          </>
        )}
      </p>
      <button
        onClick={handleDismiss}
        aria-label="Dismiss announcement"
        className="ml-1 sm:ml-2 -mr-1 sm:mr-0 mt-px sm:mt-0 shrink-0 p-1.5 rounded hover:bg-black/15 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}
