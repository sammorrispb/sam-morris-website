"use client";

import { useEffect, useState } from "react";
import { CONTACT } from "@/lib/constants";
import { ContactLink } from "@/components/ContactLink";

const TEL = CONTACT.phone.replace(/[^0-9+]/g, "");

/**
 * Mobile-only sticky bar giving the three contact methods the landing page
 * funnels into. Distinct from MobileCTA, which pushes booking on /programs
 * and /evaluation — this one never leaves the page's contact intent.
 */
export function StickyContactBar({ page }: { page: string }) {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      // Hide while scrolling down past the fold, show again on scroll up.
      setVisible(!(currentY > lastScrollY && currentY > 100));
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
      <div className="bg-navy/95 backdrop-blur-xl border-t border-white/10 px-4 py-3 flex gap-2.5 shadow-[0_-4px_20px_rgba(0,0,0,0.4)]">
        <ContactLink
          method="sms"
          page={page}
          section="sticky_contact_bar"
          href={`sms:${TEL}`}
          className="flex-1 flex items-center justify-center rounded-full btn-gradient px-4 py-2.5 text-sm font-semibold"
        >
          Text
        </ContactLink>
        <ContactLink
          method="phone"
          page={page}
          section="sticky_contact_bar"
          href={`tel:${TEL}`}
          className="flex-1 flex items-center justify-center rounded-full btn-outline px-4 py-2.5 text-sm font-medium"
        >
          Call
        </ContactLink>
        <ContactLink
          method="email"
          page={page}
          section="sticky_contact_bar"
          href={`mailto:${CONTACT.email}`}
          className="flex-1 flex items-center justify-center rounded-full btn-outline px-4 py-2.5 text-sm font-medium"
        >
          Email
        </ContactLink>
      </div>
    </div>
  );
}
