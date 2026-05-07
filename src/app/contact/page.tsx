import type { Metadata } from "next";
import Image from "next/image";
import { LeadForm } from "@/components/LeadForm";
import { TrackedExternalLink } from "@/components/TrackedExternalLink";
import { ContactLink } from "@/components/ContactLink";
import { CONTACT, SOCIAL_LINKS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact — Book Pickleball Lessons in Montgomery County, MD",
  description:
    "Book a free pickleball evaluation with Coach Sam Morris in Montgomery County, MD. Private lessons, youth academy enrollment, and family coaching. Call 301-325-4731.",
  alternates: {
    canonical: "https://www.sammorrispb.com/contact",
  },
  openGraph: {
    title: "Book Pickleball Lessons — Sam Morris | Montgomery County, MD",
    description:
      "Free evaluation, private lessons, youth academy, and family coaching in Montgomery County, MD. Call 301-325-4731.",
    url: "https://www.sammorrispb.com/contact",
    images: [
      {
        url: "/og?title=Let's%20Connect&subtitle=Book%20a%20Free%20Evaluation%20%C2%B7%20Start%20Your%20Pickleball%20Journey",
        width: 1200,
        height: 630,
        alt: "Contact Sam Morris — Book a Free Pickleball Evaluation",
      },
    ],
  },
};

export default function ContactPage() {
  return (
    <>
      {/* ─── Hero with photo backdrop ─── */}
      <section className="relative section-photo-backdrop py-24 md:py-32 px-6 -mt-16 pt-32">
        <div className="photo-bg">
          <Image
            src="/images/multi-court-outdoor.jpeg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            aria-hidden="true"
          />
        </div>
        <div className="relative mx-auto max-w-4xl text-center">
          <p className="eyebrow mb-4">Let&apos;s connect</p>
          <h1 className="font-heading font-black text-5xl md:text-7xl mb-6 leading-[0.95]">
            Get on the <span className="gradient-text-warm">court.</span>
          </h1>
          <p className="text-text-muted text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Whether you&apos;re looking for private lessons, want to enroll your
            kids in the youth academy, or need coaching for your whole family
            — I&apos;d love to hear from you.
          </p>
        </div>
      </section>

      {/* ─── Two-Column Grid ─── */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12">
          {/* Left column: Lead Form */}
          <div>
            <LeadForm heading="Get in touch" page="contact" />
          </div>

          {/* Right column: Contact Info */}
          <div className="space-y-5">
            {/* Portrait card */}
            <div className="glass-card-amber rounded-2xl p-7 text-center">
              <div className="relative w-32 h-32 rounded-full overflow-hidden glow-border mx-auto mb-5">
                <Image
                  src="/images/sam-portrait-arms-crossed.jpg"
                  alt="Sam Morris"
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              </div>
              <h3 className="font-heading font-bold text-xl mb-1">Coach Sam Morris</h3>
              <p className="text-text-muted text-sm">
                PPR Pro · DUPR Coach · M.S. in Coaching
              </p>
            </div>

            {/* Direct Contact */}
            <div className="glass-card rounded-2xl p-7">
              <h2 className="font-heading font-bold text-xl mb-4">
                Direct contact
              </h2>
              <ul className="space-y-3 text-text-muted">
                <li className="flex items-center gap-3">
                  <span className="text-accent-blue text-lg">✉</span>
                  <ContactLink
                    href={`mailto:${CONTACT.email}`}
                    method="email"
                    page="contact"
                    className="hover:text-accent-blue transition-colors break-all"
                  >
                    {CONTACT.email}
                  </ContactLink>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-accent-blue text-lg">☎</span>
                  <ContactLink
                    href={`tel:${CONTACT.phone}`}
                    method="phone"
                    page="contact"
                    className="hover:text-accent-blue transition-colors"
                  >
                    {CONTACT.phone}
                  </ContactLink>
                </li>
              </ul>
            </div>

            {/* Social Media */}
            <div className="glass-card rounded-2xl p-7">
              <h2 className="font-heading font-bold text-xl mb-4">Social</h2>
              <div className="flex flex-wrap gap-2">
                {SOCIAL_LINKS.map((link) => (
                  <TrackedExternalLink
                    key={link.platform}
                    href={link.href}
                    label={link.platform}
                    page="contact"
                    className="px-4 py-2 rounded-full text-sm border border-white/12 text-text-muted hover:text-accent-blue hover:border-accent-blue/45 transition-colors"
                  >
                    {link.platform}
                  </TrackedExternalLink>
                ))}
              </div>
            </div>

            {/* Skill Evaluation Card */}
            <div className="glass-card rounded-2xl p-7">
              <h2 className="font-heading font-bold text-xl mb-3">
                Skill evaluation
              </h2>
              <p className="text-text-muted leading-relaxed mb-4 text-sm">
                A 30-minute on-court evaluation gives you an honest read on
                your level and a personalized growth plan.
              </p>
              <ul className="space-y-3 text-text-muted text-sm">
                <li className="flex items-start gap-3">
                  <span className="text-accent-lime font-bold mt-0.5">✓</span>
                  <span>
                    <strong className="text-text-primary">Required</strong> for new Next
                    Gen Pickleball Academy players
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent-blue font-bold mt-0.5">○</span>
                  <span>
                    <strong className="text-text-primary">Optional</strong> for adult
                    private-lesson clients
                  </span>
                </li>
              </ul>
              <div className="mt-5 pt-4 border-t border-white/10 space-y-2 text-sm text-text-muted">
                <p>
                  <strong className="text-text-primary">Free</strong> — 30-minute
                  initial evaluation for every DMV player
                </p>
                <p>
                  <strong className="text-text-primary">Re-evaluation:</strong> priced
                  as a private lesson
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
