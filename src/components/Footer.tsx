"use client";

import Link from "next/link";
import Image from "next/image";
import { NAV_LINKS, SOCIAL_LINKS, CONTACT, FAMILY_LINKS } from "@/lib/constants";
import { trackEvent } from "@/lib/funnelClient";
import { familySiteUrl, familyMarketingRef } from "@/lib/urls";

export function Footer() {
  return (
    <footer className="relative section-photo-backdrop border-t border-white/5">
      <div className="photo-bg">
        <Image
          src="/images/outdoor-courts.jpeg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          aria-hidden="true"
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-20">
        {/* Tagline strip */}
        <div className="mb-14 pb-12 border-b border-white/8">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] items-end gap-8">
            <div>
              <p className="eyebrow mb-3">Coach. Builder. Dad.</p>
              <h2 className="font-heading font-black text-3xl md:text-5xl leading-tight max-w-2xl">
                Better than yesterday —{" "}
                <span className="gradient-text-warm">together.</span>
              </h2>
            </div>
            <Link
              href="/evaluation"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full btn-gradient text-sm whitespace-nowrap"
            >
              Book a Free Evaluation &rarr;
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <h3 className="font-heading text-lg font-bold text-text-primary mb-3">
              Sam<span className="text-accent-blue">.</span>Morris
            </h3>
            <p className="text-text-muted text-sm leading-relaxed">
              Coach, community builder, and entrepreneur helping families grow
              through sport in Montgomery County, MD.
            </p>
          </div>

          {/* Page links */}
          <nav aria-label="Footer pages">
            <h4 className="font-heading text-xs font-semibold text-accent-blue uppercase tracking-[0.18em] mb-4">
              Pages
            </h4>
            <ul className="flex flex-col gap-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-text-muted hover:text-accent-blue transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Sister Sites */}
          <nav aria-label="Sister sites">
            <h4 className="font-heading text-xs font-semibold text-accent-blue uppercase tracking-[0.18em] mb-4">
              Sister Sites
            </h4>
            <ul className="flex flex-col gap-2.5">
              {FAMILY_LINKS.map((link) => {
                const href = familySiteUrl(link.dest);
                return (
                  <li key={link.dest}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text-muted hover:text-accent-blue transition-colors text-sm"
                      onClick={() =>
                        trackEvent(
                          "external_link",
                          { label: link.label, url: href, page: "footer" },
                          familyMarketingRef(link.dest),
                        )
                      }
                    >
                      {link.label} ↗
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Contact + Social */}
          <div>
            <h4 className="font-heading text-xs font-semibold text-accent-blue uppercase tracking-[0.18em] mb-4">
              Contact
            </h4>
            <ul className="flex flex-col gap-2.5 mb-6">
              <li>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="text-text-muted hover:text-accent-blue transition-colors text-sm break-all"
                  onClick={() => trackEvent("cta_click", { label: "email", page: "footer", section: "contact_email" })}
                >
                  {CONTACT.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${CONTACT.phone}`}
                  className="text-text-muted hover:text-accent-blue transition-colors text-sm"
                  onClick={() => trackEvent("cta_click", { label: "phone", page: "footer", section: "contact_phone" })}
                >
                  {CONTACT.phone}
                </a>
              </li>
            </ul>

            <h4 className="font-heading text-xs font-semibold text-accent-blue uppercase tracking-[0.18em] mb-3">
              Social
            </h4>
            <ul className="flex flex-wrap gap-x-4 gap-y-2">
              {SOCIAL_LINKS.map((social) => (
                <li key={social.platform}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="me noopener noreferrer"
                    className="text-text-muted hover:text-accent-pink transition-colors text-sm"
                    onClick={() => trackEvent("external_link", { label: social.platform, url: social.href, page: "footer" })}
                  >
                    {social.platform}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-text-muted text-xs">
            &copy; {new Date().getFullYear()} Sam Morris. All rights reserved.
          </p>
          <p className="text-text-muted text-xs">
            Montgomery County, MD &middot; PPR Pro &middot; DUPR Certified
          </p>
        </div>
      </div>
    </footer>
  );
}
