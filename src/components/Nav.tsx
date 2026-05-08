"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS, COACH_BOOKING_URL } from "@/lib/constants";
import { SearchBar } from "@/components/SearchBar";
import { trackEvent } from "@/lib/funnelClient";

export function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [mobileOpen]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-navy/85 backdrop-blur-xl border-b border-white/8 shadow-[0_2px_24px_rgba(0,0,0,0.35)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link
          href="/"
          className="font-heading text-lg font-extrabold tracking-tight text-text-primary hover:text-accent-blue transition-colors"
        >
          Sam<span className="text-accent-blue">.</span>Morris
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm transition-colors ${
                  isActive
                    ? "text-accent-blue font-semibold nav-link-active"
                    : "text-text-muted hover:text-text-primary"
                }`}
                onClick={() =>
                  trackEvent("cta_click", {
                    label: link.label,
                    page: "nav",
                    section: "header_nav_desktop",
                  })
                }
              >
                {link.label}
              </Link>
            );
          })}
          <SearchBar onOpenChange={(open) => { if (open) setMobileOpen(false); }} />
          <Link
            href={COACH_BOOKING_URL}
            className="px-5 py-2 rounded-full text-sm font-semibold btn-gradient"
            onClick={() =>
              trackEvent("cta_click", {
                label: "Book a Free Evaluation",
                page: "nav",
                section: "header_cta",
                destination: COACH_BOOKING_URL,
              })
            }
          >
            Free Evaluation
          </Link>
        </div>

        {/* Mobile: search + hamburger */}
        <div className="flex md:hidden items-center gap-3">
          <SearchBar onOpenChange={(open) => { if (open) setMobileOpen(false); }} />
          <button
            type="button"
            className="text-text-muted hover:text-text-primary transition-colors"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 md:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="relative z-50 md:hidden border-t border-white/8 bg-navy/95 backdrop-blur-xl animate-fade-in">
            <div className="flex flex-col px-6 py-5 gap-4">
              {NAV_LINKS.map((link) => {
                const isActive = pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-base transition-colors ${
                      isActive
                        ? "text-accent-blue font-semibold"
                        : "text-text-muted hover:text-text-primary"
                    }`}
                    onClick={() => {
                      trackEvent("cta_click", {
                        label: link.label,
                        page: "nav",
                        section: "header_nav_mobile",
                      });
                      setMobileOpen(false);
                    }}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <Link
                href={COACH_BOOKING_URL}
                className="px-5 py-3 rounded-full text-sm font-semibold text-center mt-2 btn-gradient"
                onClick={() => {
                  trackEvent("cta_click", {
                    label: "Book a Free Evaluation",
                    page: "nav",
                    section: "header_cta_mobile",
                    destination: COACH_BOOKING_URL,
                  });
                  setMobileOpen(false);
                }}
              >
                Free Evaluation
              </Link>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
