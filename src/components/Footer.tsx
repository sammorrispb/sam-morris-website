"use client";

import Link from "next/link";
import { NAV_LINKS, SOCIAL_LINKS, CONTACT, FAMILY_LINKS } from "@/lib/constants";
import { trackEvent } from "@/lib/funnelClient";
import { familySiteUrl, familyMarketingRef } from "@/lib/urls";

export function Footer() {
  return (
    <footer className="bg-navy-light border-t border-white/5">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <h3 className="font-heading text-lg font-bold text-text-primary mb-3">
              Sam Morris
            </h3>
            <p className="text-text-muted text-sm leading-relaxed">
              Coach, community builder, and entrepreneur helping families grow
              through sport in Montgomery County, MD.
            </p>
          </div>

          {/* Page links */}
          <nav aria-label="Footer pages">
            <h4 className="font-heading text-sm font-semibold text-text-primary uppercase tracking-wider mb-4">
              Pages
            </h4>
            <ul className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-text-muted hover:text-text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Link & Dink Family */}
          <nav aria-label="Link & Dink family sites">
            <h4 className="font-heading text-sm font-semibold text-text-primary uppercase tracking-wider mb-4">
              Link &amp; Dink Family
            </h4>
            <ul className="flex flex-col gap-2">
              {FAMILY_LINKS.map((link) => {
                const href = familySiteUrl(link.dest);
                return (
                  <li key={link.dest}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text-muted hover:text-text-primary transition-colors text-sm"
                      onClick={() =>
                        trackEvent(
                          "external_link",
                          { label: link.label, url: href, page: "footer" },
                          familyMarketingRef(link.dest),
                        )
                      }
                    >
                      {link.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Contact + Social */}
          <div>
            <h4 className="font-heading text-sm font-semibold text-text-primary uppercase tracking-wider mb-4">
              Contact
            </h4>
            <ul className="flex flex-col gap-2 mb-6">
              <li>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="text-text-muted hover:text-text-primary transition-colors text-sm"
                  onClick={() => trackEvent("cta_click", { label: "email", page: "footer", section: "contact_email" })}
                >
                  {CONTACT.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${CONTACT.phone}`}
                  className="text-text-muted hover:text-text-primary transition-colors text-sm"
                  onClick={() => trackEvent("cta_click", { label: "phone", page: "footer", section: "contact_phone" })}
                >
                  {CONTACT.phone}
                </a>
              </li>
            </ul>

            <h4 className="font-heading text-sm font-semibold text-text-primary uppercase tracking-wider mb-3">
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
        <div className="mt-12 pt-8 border-t border-white/5 text-center">
          <p className="text-text-muted text-xs">
            &copy; {new Date().getFullYear()} Sam Morris. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
