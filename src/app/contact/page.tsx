import type { Metadata } from "next";
import { LeadForm } from "@/components/LeadForm";
import { CONTACT, SOCIAL_LINKS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Sam Morris. Book a free evaluation, inquire about coaching, or connect on social media.",
};

export default function ContactPage() {
  return (
    <>
      {/* ─── Hero ─── */}
      <section className="relative py-20 px-6 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.08),transparent_70%)]">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-heading font-black text-5xl md:text-6xl mb-6">
            Let&apos;s <span className="gradient-text">Connect</span>
          </h1>
          <p className="text-text-muted text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Whether you&apos;re looking for coaching, want to learn about
            programs, or just want to talk pickleball &mdash; I&apos;d love to
            hear from you.
          </p>
        </div>
      </section>

      {/* ─── Two-Column Grid ─── */}
      <section className="py-16 px-6">
        <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left column: Lead Form */}
          <div>
            <LeadForm heading="Get in Touch" />
          </div>

          {/* Right column: Contact Info */}
          <div className="space-y-6">
            {/* Direct Contact */}
            <div className="bg-navy-light glow-border rounded-xl p-6">
              <h2 className="font-heading font-bold text-2xl mb-4">
                Direct Contact
              </h2>
              <ul className="space-y-3 text-text-muted">
                <li>
                  <a
                    href={`mailto:${CONTACT.email}`}
                    className="hover:text-accent-blue transition-colors"
                  >
                    {CONTACT.email}
                  </a>
                </li>
                <li>
                  <a
                    href={`tel:${CONTACT.phone}`}
                    className="hover:text-accent-blue transition-colors"
                  >
                    {CONTACT.phone}
                  </a>
                </li>
              </ul>
            </div>

            {/* Social Media */}
            <div className="bg-navy-light glow-border rounded-xl p-6">
              <h2 className="font-heading font-bold text-2xl mb-4">
                Social Media
              </h2>
              <ul className="space-y-3">
                {SOCIAL_LINKS.map((link) => (
                  <li key={link.platform}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text-muted hover:text-accent-pink transition-colors"
                    >
                      {link.platform}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Free Evaluation Card */}
            <div className="bg-navy-light glow-border rounded-xl p-6">
              <h2 className="font-heading font-bold text-2xl mb-3">
                Free Evaluation
              </h2>
              <p className="text-text-muted leading-relaxed">
                Not sure which program is right for your child? Book a free
                30-minute evaluation and we&apos;ll find the perfect fit
                together.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
