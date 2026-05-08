"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { trackEvent } from "@/lib/funnelClient";
import { COACH_BOOKING_URL } from "@/lib/constants";

export function MobileCTA() {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastScrollY && currentY > 100) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      setLastScrollY(currentY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 md:hidden transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="bg-navy/95 backdrop-blur-xl border-t border-white/10 px-4 py-3 flex gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.4)]">
        <a
          href="tel:301-325-4731"
          onClick={() =>
            trackEvent("cta_click", {
              label: "phone",
              page: window.location.pathname,
              section: "mobile_sticky_cta",
            })
          }
          className="flex-1 flex items-center justify-center gap-2 rounded-full btn-outline px-4 py-2.5 text-sm font-medium"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
            />
          </svg>
          Call
        </a>
        <Link
          href={COACH_BOOKING_URL}
          onClick={() =>
            trackEvent("cta_click", {
              label: "Book Free Eval",
              page: window.location.pathname,
              section: "mobile_sticky_cta",
              destination: COACH_BOOKING_URL,
            })
          }
          className="flex-1 flex items-center justify-center gap-2 rounded-full btn-gradient px-4 py-2.5 text-sm"
        >
          Book Free Eval
        </Link>
      </div>
    </div>
  );
}
