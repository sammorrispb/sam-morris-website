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
    () => true, // SSR / initial — assume dismissed, render nothing
  );
}

export function AnnouncementBanner() {
  const persistedDismissed = useDismissedFromStorage(ANNOUNCEMENT?.id);
  const [locallyDismissed, setLocallyDismissed] = useState(false);
  const dismissed = persistedDismissed || locallyDismissed;

  if (!ANNOUNCEMENT || dismissed) return null;

  function handleDismiss() {
    localStorage.setItem(`dismissed-announcement-${ANNOUNCEMENT!.id}`, "1");
    setLocallyDismissed(true);
  }

  return (
    <div className="bg-accent-blue text-white px-6 py-3 flex items-center justify-center gap-3 text-sm">
      <p className="text-center">
        {ANNOUNCEMENT.message}
        {ANNOUNCEMENT.href && ANNOUNCEMENT.linkText && (
          <>
            {" "}
            <Link
              href={ANNOUNCEMENT.href}
              className="underline underline-offset-2 font-semibold hover:text-white/80"
            >
              {ANNOUNCEMENT.linkText} &rarr;
            </Link>
          </>
        )}
      </p>
      <button
        onClick={handleDismiss}
        aria-label="Dismiss announcement"
        className="ml-2 shrink-0 p-1 rounded hover:bg-white/20 transition-colors"
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
