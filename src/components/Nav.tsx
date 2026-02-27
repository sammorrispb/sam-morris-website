"use client";

import { useState } from "react";
import Link from "next/link";
import { NAV_LINKS } from "@/lib/constants";

export function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-navy/80 backdrop-blur-md border-b border-white/5">
      <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link
          href="/"
          className="font-heading text-lg font-bold text-text-primary tracking-tight"
        >
          Sam Morris
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-text-muted hover:text-text-primary transition-colors text-sm"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="text-white px-4 py-2 rounded-lg text-sm font-medium"
            style={{
              background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
            }}
          >
            Book a Free Evaluation
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden text-text-muted hover:text-text-primary transition-colors"
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
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

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/5 bg-navy/95 backdrop-blur-md animate-fade-in">
          <div className="flex flex-col px-6 py-4 gap-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-text-muted hover:text-text-primary transition-colors text-sm"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="text-white px-4 py-2 rounded-lg text-sm font-medium text-center mt-2"
              style={{
                background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
              }}
              onClick={() => setMobileOpen(false)}
            >
              Book a Free Evaluation
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
