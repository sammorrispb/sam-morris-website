import type { Metadata } from "next";
import Image from "next/image";
import { LeadForm } from "@/components/LeadForm";
import { TrackedExternalLink } from "@/components/TrackedExternalLink";
import { ContactLink } from "@/components/ContactLink";
import {
  CONTACT,
  NGA_WHATSAPP_GROUP,
  SOCIAL_LINKS,
  WHATSAPP_GROUP,
} from "@/lib/constants";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact — Book Pickleball Lessons in MoCo, MD",
  description:
    "Book pickleball coaching with Coach Sam Morris in Montgomery County, MD. Private lessons, youth academy, family coaching. Call 301-325-4731.",
  alternates: {
    canonical: "https://www.sammorrispb.com/contact",
  },
  openGraph: {
    title: "Contact — Book Pickleball Lessons in MoCo, MD",
    description:
      "Private lessons, group clinics, youth academy, and family coaching in Montgomery County, MD. Call 301-325-4731.",
    url: "https://www.sammorrispb.com/contact",
    images: [
      {
        url: "/og?title=Let's%20Connect&subtitle=Request%20a%20Lesson%20%C2%B7%20Start%20Your%20Pickleball%20Journey",
        width: 1200,
        height: 630,
        alt: "Contact Sam Morris — Request a Pickleball Lesson",
      },
    ],
  },
  twitter: {
    title: "Contact — Book Pickleball Lessons in MoCo, MD",
  },
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", href: "/" },
              { name: "Contact", href: "/contact" },
            ])
          ),
        }}
      />
      {/* ─── Hero with photo backdrop ─── */}
      <section className="relative section-photo-backdrop py-24 md:py-32 px-6 hero-nav-offset-roomy">
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

            {/* WhatsApp Community */}
            <div className="glass-card rounded-2xl p-7">
              <h2 className="font-heading font-bold text-xl mb-2">Community</h2>
              <p className="text-text-muted leading-relaxed mb-4 text-sm">
                Join the {WHATSAPP_GROUP.name} WhatsApp group for game invites,
                court updates, and to connect with other local players.
              </p>
              <TrackedExternalLink
                href={WHATSAPP_GROUP.href}
                label="WhatsApp Group"
                page="contact"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border border-white/12 text-text-muted hover:text-accent-lime hover:border-accent-lime/45 transition-colors"
              >
                <svg
                  className="w-4 h-4 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Join on WhatsApp
              </TrackedExternalLink>
              <p className="text-text-muted text-sm leading-relaxed mt-5">
                Got a kid who plays?{" "}
                <TrackedExternalLink
                  href={NGA_WHATSAPP_GROUP.href}
                  label="WhatsApp Group — Next Gen parents"
                  page="contact"
                  className="text-accent-lime hover:underline underline-offset-4"
                >
                  {NGA_WHATSAPP_GROUP.name} on WhatsApp
                </TrackedExternalLink>{" "}
                is the youth academy group.
              </p>
            </div>

            {/* Private Lesson Card */}
            <div className="glass-card rounded-2xl p-7">
              <h2 className="font-heading font-bold text-xl mb-3">
                Private lessons
              </h2>
              <p className="text-text-muted leading-relaxed mb-4 text-sm">
                Every session is 1-on-1 and built around the part of your game
                you most want to fix — with video review when it helps.
              </p>
              <ul className="space-y-3 text-text-muted text-sm">
                <li className="flex items-start gap-3">
                  <span className="text-accent-lime font-bold mt-0.5">✓</span>
                  <span>
                    <strong className="text-text-primary">Single sessions</strong> or
                    4-session packages
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent-blue font-bold mt-0.5">○</span>
                  <span>
                    <strong className="text-text-primary">Junior lessons</strong> for
                    kids who want focused 1-on-1 time
                  </span>
                </li>
              </ul>
              <div className="mt-5 pt-4 border-t border-white/10 space-y-2 text-sm text-text-muted">
                <p>
                  Request a time and Sam confirms the slot and sends an invoice —
                  no public price list, every quote fits the session.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
