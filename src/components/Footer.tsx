import Link from "next/link";
import { NAV_LINKS, SOCIAL_LINKS, CONTACT, PROJECT_LINKS } from "@/lib/constants";

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
          <div>
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
          </div>

          {/* Projects */}
          <div>
            <h4 className="font-heading text-sm font-semibold text-text-primary uppercase tracking-wider mb-4">
              Projects
            </h4>
            <ul className="flex flex-col gap-2">
              {PROJECT_LINKS.map((project) => (
                <li key={project.label}>
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-muted hover:text-text-primary transition-colors text-sm"
                  >
                    {project.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

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
                >
                  {CONTACT.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${CONTACT.phone}`}
                  className="text-text-muted hover:text-text-primary transition-colors text-sm"
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
                    rel="noopener noreferrer"
                    className="text-text-muted hover:text-accent-pink transition-colors text-sm"
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
