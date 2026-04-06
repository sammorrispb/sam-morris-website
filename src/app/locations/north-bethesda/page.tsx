import type { Metadata } from "next";
import Link from "next/link";
import {
  LOCATIONS,
  WIDGET_URLS,
  PROGRAM_CATEGORIES,
  FIRST_VISIT,
  FIRST_VISIT_TESTIMONIAL,
} from "@/lib/locations";
import { TrackedExternalLink } from "@/components/TrackedExternalLink";
import { breadcrumbJsonLd } from "@/lib/seo";

const loc = LOCATIONS.northBethesda;
const urls = WIDGET_URLS.northBethesda;
const COURTS = 9;

export const metadata: Metadata = {
  title:
    "Dill Dinkers North Bethesda — Indoor Pickleball Courts, Leagues & Coaching",
  description:
    "Indoor pickleball at Dill Dinkers North Bethesda. 9 courts, leagues, open play, coached sessions, coaching, and youth programs. 4942 Boiling Brook Pkwy, North Bethesda, MD 20852.",
  keywords: [
    "pickleball North Bethesda",
    "indoor pickleball Bethesda",
    "Dill Dinkers North Bethesda",
    "pickleball courts Bethesda",
    "pickleball lessons Bethesda MD",
    "pickleball leagues North Bethesda",
  ],
  alternates: {
    canonical: "https://www.sammorrispb.com/locations/north-bethesda",
  },
  openGraph: {
    title: "Dill Dinkers North Bethesda — Indoor Pickleball Courts, Leagues & Coaching",
    description:
      "Indoor pickleball at Dill Dinkers North Bethesda. 9 courts, leagues, open play, coached sessions, coaching, and youth programs.",
    url: "https://www.sammorrispb.com/locations/north-bethesda",
    images: [
      {
        url: "/og?title=Dill%20Dinkers%20North%20Bethesda&subtitle=9%20Indoor%20Courts%20%C2%B7%204942%20Boiling%20Brook%20Pkwy",
        width: 1200,
        height: 630,
        alt: "Dill Dinkers North Bethesda Indoor Pickleball",
      },
    ],
  },
};

const breadcrumbs = [
  { name: "Home", href: "/" },
  { name: "Facilities", href: "/locations" },
  { name: "North Bethesda", href: "/locations/north-bethesda" },
];

const sportsLocationJsonLd = {
  "@context": "https://schema.org",
  "@type": "SportsActivityLocation",
  name: loc.name,
  address: {
    "@type": "PostalAddress",
    streetAddress: loc.address,
    addressLocality: loc.city,
    addressRegion: loc.state,
    postalCode: loc.zip,
    addressCountry: "US",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 39.0334,
    longitude: -77.1144,
  },
  telephone: loc.phone,
  url: "https://www.sammorrispb.com/locations/north-bethesda",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "06:00",
      closes: "22:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday", "Sunday"],
      opens: "07:00",
      closes: "22:00",
    },
  ],
};

const AMENITIES = [
  "Climate-controlled indoor facility",
  `${COURTS} dedicated pickleball courts`,
  "Pro shop and paddle rentals",
  "Lounge and viewing areas",
  "Professional coaching staff",
  "Ample free parking",
];

const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Dill+Dinkers+North+Bethesda+4942+Boiling+Brook+Pkwy+North+Bethesda+MD";

export default function NorthBethesdaPage() {
  return (
    <>
      {/* JSON-LD structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(sportsLocationJsonLd),
        }}
      />

      {/* ─── Hero ─── */}
      <section className="relative py-20 md:py-28 px-6 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.08),transparent_70%)]">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="font-heading font-black text-4xl md:text-6xl leading-tight mb-3">
            <span className="gradient-text">{loc.name}</span>
          </h1>
          <p className="text-text-muted text-lg md:text-xl mb-2">
            {loc.address}, {loc.city}, {loc.state} {loc.zip}
          </p>
          <p className="text-text-muted mb-8">
            <a
              href={`tel:${loc.phone.replace(/-/g, "")}`}
              className="hover:text-accent-blue transition-colors"
            >
              {loc.phone}
            </a>
            {" · "}
            <a
              href={`mailto:${loc.email}`}
              className="hover:text-accent-blue transition-colors"
            >
              {loc.email}
            </a>
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <TrackedExternalLink
              href={urls.publicBooking}
              label="Book a Court — North Bethesda"
              page="locations/north-bethesda"
              className="inline-block text-white font-heading font-semibold px-8 py-3 rounded-lg btn-gradient"
            >
              Book a Court
            </TrackedExternalLink>
            <TrackedExternalLink
              href={urls.membership}
              label="Become a Member — North Bethesda"
              page="locations/north-bethesda"
              className="inline-block font-heading font-semibold px-8 py-3 rounded-lg border border-white/10 text-text-muted hover:border-accent-blue/40 hover:text-text-primary transition-all"
            >
              Become a Member
            </TrackedExternalLink>
          </div>
        </div>
      </section>

      {/* ─── Facility Details ─── */}
      <section className="bg-navy-light py-20 px-6">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4 text-center">
            The Facility
          </h2>
          <p className="text-text-muted max-w-2xl mx-auto mb-10 text-center">
            {COURTS} dedicated indoor pickleball courts with climate-controlled
            play year-round &mdash; no weather cancellations, ever.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {AMENITIES.map((amenity) => (
              <div
                key={amenity}
                className="bg-navy glow-border rounded-xl p-6 card-hover"
              >
                <p className="text-text-primary text-sm font-medium">
                  {amenity}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Programs Grid ─── */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4 text-center">
            Programs at North Bethesda
          </h2>
          <p className="text-text-muted max-w-2xl mx-auto mb-10 text-center">
            Browse programs and register directly through CourtReserve.
          </p>
          <div className="space-y-12">
            {PROGRAM_CATEGORIES.map((category) => (
              <div key={category.name}>
                <h3
                  className="font-heading font-bold text-xl mb-6"
                  style={{ color: category.color }}
                >
                  {category.name}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.programs.map((program) => (
                    <TrackedExternalLink
                      key={program.key}
                      href={urls[program.key]}
                      label={`${program.label} — North Bethesda`}
                      page="locations/north-bethesda"
                      className="bg-navy-light glow-border rounded-xl p-6 card-hover block"
                    >
                      <span
                        className="text-2xl mb-3 block"
                        role="img"
                        aria-hidden="true"
                      >
                        {program.emoji}
                      </span>
                      <h4 className="font-heading font-semibold text-lg mb-2 text-text-primary">
                        {program.label}
                      </h4>
                      <p className="text-text-muted text-sm leading-relaxed">
                        {program.description}
                      </p>
                      <span className="text-accent-blue text-sm font-semibold mt-3 inline-block">
                        Register &rarr;
                      </span>
                    </TrackedExternalLink>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── First Visit Guide ─── */}
      <section className="bg-navy-light py-20 px-6">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4 text-center">
            Your First Visit
          </h2>
          <p className="text-text-muted max-w-2xl mx-auto mb-10 text-center">
            Never been to {loc.name}? Here&rsquo;s everything you need to know.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
            {FIRST_VISIT.map((item) => (
              <div
                key={item.title}
                className="bg-navy glow-border rounded-xl p-6"
              >
                <span
                  className="text-2xl mb-3 block"
                  role="img"
                  aria-hidden="true"
                >
                  {item.emoji}
                </span>
                <h3 className="font-heading font-semibold text-lg mb-2">
                  {item.title}
                </h3>
                <p className="text-text-muted text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
          <div className="bg-navy glow-border rounded-xl p-8 text-center max-w-2xl mx-auto">
            <blockquote className="text-text-primary text-lg italic leading-relaxed mb-3">
              &ldquo;{FIRST_VISIT_TESTIMONIAL.quote}&rdquo;
            </blockquote>
            <cite className="text-text-muted text-sm not-italic">
              &mdash; {FIRST_VISIT_TESTIMONIAL.author}
            </cite>
          </div>
        </div>
      </section>

      {/* ─── Directions ─── */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">
            Getting Here
          </h2>
          <p className="text-text-muted max-w-2xl mx-auto mb-6">
            {loc.address}, {loc.city}, {loc.state} {loc.zip}. Located near the
            intersection of Nicholson Lane and Boiling Brook Parkway with ample
            free parking.
          </p>
          <TrackedExternalLink
            href={MAPS_URL}
            label="Google Maps — North Bethesda"
            page="locations/north-bethesda"
            className="inline-block font-heading font-semibold px-8 py-3 rounded-lg border border-white/10 text-text-muted hover:border-accent-blue/40 hover:text-text-primary transition-all"
          >
            Open in Google Maps &rarr;
          </TrackedExternalLink>
        </div>
      </section>

      {/* ─── Bottom CTA ─── */}
      <section className="bg-navy-light py-20 px-6">
        <div className="mx-auto max-w-2xl">
          <div className="bg-navy glow-border rounded-xl p-10 text-center">
            <p className="font-heading font-bold text-xl md:text-2xl mb-6">
              Not sure where to start?
            </p>
            <Link
              href="/contact"
              className="inline-block text-white font-heading font-semibold px-8 py-3 rounded-lg btn-gradient"
            >
              Book a Free Evaluation
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
