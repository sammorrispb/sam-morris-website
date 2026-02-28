import type { Metadata } from "next";
import Image from "next/image";
import { LeadForm } from "@/components/LeadForm";
import { CONTACT, SOCIAL_LINKS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact — Book Pickleball Lessons in Montgomery County, MD",
  description:
    "Book a free pickleball evaluation with Coach Sam Morris in Montgomery County, MD. Private lessons, youth academy enrollment, and family coaching at Dill Dinkers Rockville & North Bethesda. Call 301-325-4731.",
  alternates: {
    canonical: "https://www.sammorrispb.com/contact",
  },
  openGraph: {
    title: "Book Pickleball Lessons — Sam Morris | Montgomery County, MD",
    description:
      "Free evaluation, private lessons, youth academy, and family coaching. Dill Dinkers Rockville & North Bethesda. Call 301-325-4731.",
    url: "https://www.sammorrispb.com/contact",
    images: [
      {
        url: "/images/sam-portrait-arms-crossed.jpg",
        width: 1200,
        height: 630,
        alt: "Contact Sam Morris for pickleball coaching in Montgomery County, MD",
      },
    ],
  },
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
            Whether you&apos;re looking for pickleball lessons in Montgomery
            County, want to enroll your kids in the youth academy, or need
            coaching for your whole family &mdash; I&apos;d love to hear from
            you. Serving Rockville, North Bethesda, Olney, Bethesda,
            Gaithersburg, and all of Montgomery County, MD.
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
            {/* Portrait */}
            <div className="flex justify-center">
              <div className="relative w-32 h-32 rounded-full overflow-hidden glow-border">
                <Image
                  src="/images/sam-portrait-arms-crossed.jpg"
                  alt="Sam Morris"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

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

            {/* Skill Evaluation Card */}
            <div className="bg-navy-light glow-border rounded-xl p-6">
              <h2 className="font-heading font-bold text-2xl mb-3">
                Skill Evaluation
              </h2>
              <p className="text-text-muted leading-relaxed mb-4">
                Every evaluation includes creating a free{" "}
                <a
                  href="https://www.linkanddink.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-blue hover:text-accent-purple transition-colors underline"
                >
                  Link&nbsp;&amp;&nbsp;Dink
                </a>{" "}
                account so your skill level is tracked over time.
              </p>
              <ul className="space-y-3 text-text-muted text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-accent-green font-bold mt-0.5">✓</span>
                  <span>
                    <strong className="text-text">Required</strong> for new Next
                    Gen Pickleball Academy players
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-blue font-bold mt-0.5">○</span>
                  <span>
                    <strong className="text-text">Optional</strong> for Dill
                    Dinkers players
                  </span>
                </li>
              </ul>
              <div className="mt-5 pt-4 border-t border-white/10 space-y-2 text-sm text-text-muted">
                <p>
                  <strong className="text-text">Free</strong> &mdash; Dill
                  Dinkers Rockville &amp; North Bethesda members
                </p>
                <p>
                  <strong className="text-text">$15 / person</strong> &mdash;
                  Non-members
                </p>
                <p>
                  <strong className="text-text">Re-evaluation:</strong> $35 /
                  30&nbsp;min 1-on-1 with Coach Sam
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
