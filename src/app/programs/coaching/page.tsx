import type { Metadata } from "next";
import Image from "next/image";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { PageSectionNav } from "@/components/PageSectionNav";
import { BackToTop } from "@/components/BackToTop";
import { LeadForm } from "@/components/LeadForm";
import { TrackedExternalLink } from "@/components/TrackedExternalLink";
import { ScrollDepthTracker } from "@/components/ScrollDepthTracker";
import { breadcrumbJsonLd } from "@/lib/seo";
import { getTestimonialsByProgram } from "@/lib/testimonials";
import { TestimonialGrid } from "@/components/TestimonialGrid";

export const metadata: Metadata = {
  title: "Coaching & Clinics — Sam Morris Pickleball | Montgomery County, MD",
  description:
    "Private pickleball lessons and coaching with PPR-certified Coach Sam Morris. Single sessions and 4-pack packages in Montgomery County, MD.",
  keywords: [
    "private pickleball lessons Montgomery County",
    "pickleball coach Montgomery County",
    "PPR certified pickleball coach Maryland",
    "pickleball coaching near me",
    "pickleball instruction DC area",
    "pickleball coach near DC",
  ],
  alternates: { canonical: "https://www.sammorrispb.com/programs/coaching" },
  openGraph: {
    title: "Coaching & Clinics — Sam Morris Pickleball",
    description: "Private lessons and coaching in Montgomery County, MD.",
    url: "https://www.sammorrispb.com/programs/coaching",
    images: [
      {
        url: "/og?title=Coaching%20%26%20Clinics&subtitle=Private%20Lessons%20from%20%24130%20%C2%B7%204-Pack%20Available",
        width: 1200,
        height: 630,
        alt: "Coaching & Clinics — Sam Morris Pickleball",
      },
    ],
  },
};

const SECTIONS = [
  { id: "why-train", label: "Why Train" },
  { id: "private-lessons", label: "Private Lessons" },
  { id: "ready-to-start", label: "Get Started" },
];

export default function CoachingPage() {
  return (
    <div className="page-sam-morris">
      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", href: "/" },
              { name: "Programs", href: "/programs" },
              { name: "Coaching & Clinics", href: "/programs/coaching" },
            ])
          ),
        }}
      />
      {/* Service Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Private Pickleball Lessons",
            provider: {
              "@type": "Person",
              name: "Sam Morris",
              jobTitle: "PPR-Certified Pickleball Coach",
            },
            areaServed: {
              "@type": "AdministrativeArea",
              name: "Montgomery County, Maryland",
            },
            description:
              "One-on-one private pickleball lessons with PPR-certified coach Sam Morris in Montgomery County, MD.",
            offers: [
              {
                "@type": "Offer",
                name: "Single Lesson",
                price: "130.00",
                priceCurrency: "USD",
              },
              {
                "@type": "Offer",
                name: "4-Session Package",
                price: "400.00",
                priceCurrency: "USD",
                description: "$100 per session",
              },
            ],
          }),
        }}
      />
      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "How much do private pickleball lessons cost?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Private 1-on-1 pickleball lessons with Sam Morris are $130 per session or $400 for a 4-session package ($100/session). Book at sammorrispb.com/programs/coaching.",
                },
              },
              {
                "@type": "Question",
                name: "Where do lessons happen?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Sam Morris coaches in Montgomery County, MD. Exact location is confirmed when you book based on your availability and the area you're closest to.",
                },
              },
            ],
          }),
        }}
      />
      <ScrollDepthTracker page="coaching" />
      <PageSectionNav sections={SECTIONS} brandColor="#4DACD0" />
      <BackToTop />
      {/* Hero */}
      <section className="relative py-20 md:py-28 px-6 hero-sam-morris">
        <div className="relative mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1 text-center md:text-left">
              <span className="brand-badge brand-badge-sm mb-4">Sam Morris Coaching</span>
              <h1 className="font-heading font-black text-4xl md:text-6xl leading-tight mb-6">
                Coaching &amp; <span className="gradient-text-sm">Clinics</span>
              </h1>
              <p className="text-text-muted text-lg md:text-xl max-w-xl">
                Private lessons and small-group coaching in Montgomery County, MD —
                tailored to your level and the parts of your game you most want to
                level up.
              </p>
            </div>
            <div className="shrink-0 hidden md:block">
              <Image
                src="/images/sam-portrait-arms-crossed.jpg"
                alt="Coach Sam Morris"
                width={260}
                height={340}
                className="rounded-2xl glow-border-sm object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Train */}
      <section id="why-train" className="py-16 px-6 scroll-mt-28">
        <div className="mx-auto max-w-4xl">
          <AnimateOnScroll>
            <h2 className="font-heading text-2xl md:text-3xl mb-8">Why Train with a Coach?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "Personalized Feedback", desc: "Real-time corrections on technique, footwork, and positioning" },
                { title: "Strategic Development", desc: "Shot selection, court positioning, and tactics for your level" },
                { title: "Structured Progression", desc: "Clear pathway from beginner fundamentals to advanced play" },
                { title: "Accountability", desc: "Stay committed to your goals with consistent coaching support" },
                { title: "Faster Skill Acquisition", desc: "Avoid common mistakes and build proper habits from the start" },
              ].map((item) => (
                <div key={item.title} className="card-sm p-6">
                  <h3 className="font-heading text-text-primary mb-2">{item.title}</h3>
                  <p className="text-text-muted text-sm">{item.desc}</p>
                </div>
              ))}
              <div className="hidden lg:block">
                <Image
                  src="/images/poster-3rd-shot.webp"
                  alt="Third shot drop technique"
                  width={300}
                  height={200}
                  className="rounded-xl glow-border-sm object-cover w-full h-full"
                />
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Private Lessons */}
      <section id="private-lessons" className="py-16 px-6 scroll-mt-28">
        <div className="mx-auto max-w-4xl">
          <AnimateOnScroll>
            <h2 className="font-heading text-2xl md:text-3xl mb-8">Private Lessons</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card-sm p-6">
                <h3 className="font-heading font-bold text-lg mb-3">Single Session</h3>
                <ul className="space-y-2 text-text-muted text-sm mb-4">
                  <li>1 hour of personalized instruction</li>
                  <li>Court time included</li>
                  <li>Great for trying out coaching or a specific skill</li>
                </ul>
                <p className="font-heading font-bold text-xl mb-4">$130<span className="text-text-muted text-sm font-normal">/hour</span></p>
                <TrackedExternalLink
                  href="https://buy.stripe.com/aFabJ3ehjaUhfI7g6s3Je01"
                  label="Book Single Session"
                  page="coaching"
                  className="inline-block text-white font-heading font-semibold px-6 py-3 rounded-lg btn-sm text-sm"
                >
                  Book Single Session
                </TrackedExternalLink>
              </div>
              <div className="card-sm p-6">
                <h3 className="font-heading font-bold text-lg mb-3">4-Session Package</h3>
                <ul className="space-y-2 text-text-muted text-sm mb-4">
                  <li>4 hours of personalized instruction</li>
                  <li>Court time included for all sessions</li>
                  <li>Best value — save $120</li>
                </ul>
                <p className="font-heading font-bold text-xl mb-4">$400<span className="text-text-muted text-sm font-normal"> ($100/hour)</span></p>
                <TrackedExternalLink
                  href="https://buy.stripe.com/00w00l8WZe6t7bBdYk3Je08"
                  label="Book 4-Session Package"
                  page="coaching"
                  className="inline-block text-white font-heading font-semibold px-6 py-3 rounded-lg btn-sm text-sm"
                >
                  Book 4-Session Package
                </TrackedExternalLink>
              </div>
            </div>
            <div className="mt-8 text-center">
              <p className="text-text-muted text-sm mb-4">Already purchased? Pick your time:</p>
              <TrackedExternalLink
                href="https://calendar.app.google/FsvvwDzNPGUX6VZbA"
                label="Schedule Your Lesson"
                page="coaching"
                className="inline-block text-white font-heading font-semibold px-8 py-3 rounded-lg btn-sm text-sm"
              >
                Schedule Your Lesson →
              </TrackedExternalLink>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Next Steps CTA */}
      <section id="ready-to-start" className="py-16 px-6 scroll-mt-28">
        <div className="mx-auto max-w-3xl">
          <div className="card-sm p-8">
            <h2 className="font-heading font-bold text-xl mb-4 text-center">Ready to Start?</h2>
            <ol className="space-y-2 text-text-muted text-sm list-decimal list-inside max-w-md mx-auto">
              <li><strong className="text-text-primary">Book a free skill evaluation</strong> if you&apos;re new to coaching</li>
              <li><strong className="text-text-primary">Pick a single session</strong> to try out a focused topic</li>
              <li><strong className="text-text-primary">Commit to the 4-pack</strong> for real, structured improvement</li>
            </ol>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-text-primary text-center mb-10">
            What Our Students Say
          </h2>
          <TestimonialGrid testimonials={getTestimonialsByProgram("coaching")} limit={3} />
        </div>
      </section>

      {/* Lead Capture */}
      <section className="py-16 px-6">
        <div className="mx-auto max-w-3xl">
          <LeadForm heading="Interested in Coaching?" page="coaching" />
        </div>
      </section>
    </div>
  );
}
