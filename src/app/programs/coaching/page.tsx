import type { Metadata } from "next";
import Image from "next/image";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { PageSectionNav } from "@/components/PageSectionNav";
import { BackToTop } from "@/components/BackToTop";
import { LeadForm } from "@/components/LeadForm";
import { TrackedExternalLink } from "@/components/TrackedExternalLink";
import { ScrollDepthTracker } from "@/components/ScrollDepthTracker";
import { breadcrumbJsonLd } from "@/lib/seo";
import { RelatedPrograms } from "@/components/RelatedPrograms";
import { getTestimonialsByProgram } from "@/lib/testimonials";
import { TestimonialGrid } from "@/components/TestimonialGrid";

export const metadata: Metadata = {
  title: "Coaching & Clinics — Sam Morris Pickleball, Montgomery County MD",
  description:
    "Private pickleball lessons and group clinics with PPR-certified Coach Sam Morris in Montgomery County, MD.",
  keywords: [
    "private pickleball lessons Rockville",
    "pickleball coach Montgomery County",
    "pickleball clinics North Bethesda",
    "PPR certified pickleball coach Maryland",
    "pickleball coaching near me",
    "group pickleball lessons Bethesda",
    "pickleball instruction DC area",
    "pickleball coach near DC",
  ],
  alternates: { canonical: "https://www.sammorrispb.com/programs/coaching" },
  openGraph: {
    title: "Coaching & Clinics — Sam Morris Pickleball, Montgomery County MD",
    description: "Private lessons and group clinics with PPR-certified Coach Sam Morris.",
    url: "https://www.sammorrispb.com/programs/coaching",
    images: [
      {
        url: "/og?title=Coaching%20%26%20Clinics&subtitle=Private%20Lessons%20from%20%24130",
        width: 1200,
        height: 630,
        alt: "Coaching & Clinics — Sam Morris Pickleball",
      },
    ],
  },
};

type CoachLink = { name: string; role: string; email?: string; phone?: string; bio?: string; link?: string; linkLabel?: string; color: string; isHead: boolean };

const COACHES: CoachLink[] = [
  { name: "Sam Morris", role: "PPR-Certified Pickleball Coach", email: "sam.morris2131@gmail.com", bio: "9 years MCPS Physical Educator, Master\u2019s in Coaching. Co-founder of Next Gen Pickleball Academy and Pickleball Climb 5.0.", color: "#4DACD0", isHead: true },
];

const SECTIONS = [
  { id: "why-train", label: "Why Train" },
  { id: "private-lessons", label: "Private Lessons" },
  { id: "coaches", label: "About Sam" },
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
              jobTitle: "Professional Pickleball Coach",
            },
            areaServed: {
              "@type": "AdministrativeArea",
              name: "Montgomery County, MD",
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
      {/* HowTo Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to Book Pickleball Coaching with Sam Morris",
            step: [
              {
                "@type": "HowToStep",
                text: "Choose a single lesson or a 4-session package.",
              },
              {
                "@type": "HowToStep",
                text: "Book and pay through the Stripe Payment Link.",
              },
              {
                "@type": "HowToStep",
                text: "Schedule your session with Coach Sam after purchase.",
              },
            ],
          }),
        }}
      />
      {/* Coach Person Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            COACHES.map((coach) => ({
              "@context": "https://schema.org",
              "@type": "Person",
              name: coach.name,
              jobTitle: coach.role,
              ...(coach.email && { email: coach.email }),
              ...(coach.phone && { telephone: coach.phone }),
            })),
          ),
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
                name: "How much do private pickleball lessons with Sam Morris cost?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Private 1-on-1 pickleball lessons with Sam Morris are $130 per session or $400 for a 4-session package ($100/session). Book at sammorrispb.com/programs/coaching.",
                },
              },
              {
                "@type": "Question",
                name: "How do I find a pickleball coach in Montgomery County, MD?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Sam Morris is a PPR/DUPR-certified pickleball coach serving Montgomery County, MD. Visit sammorrispb.com/programs/coaching to book lessons.",
                },
              },
            ],
          }),
        }}
      />
      {/* Video Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "VideoObject",
            name: "Pickleball Coaching Tips with Sam Morris",
            description: "Professional pickleball coaching tips, drills, and strategy from PPR-certified coach Sam Morris in Montgomery County, MD.",
            thumbnailUrl: "https://www.sammorrispb.com/images/sam-court-smile.jpg",
            uploadDate: "2025-01-01",
            contentUrl: "https://youtube.com/@sammorris.pb8",
            embedUrl: "https://www.youtube.com/embed?listType=user_uploads&list=sammorris.pb8",
            publisher: {
              "@type": "Person",
              name: "Sam Morris",
              url: "https://www.sammorrispb.com",
            },
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
                Private lessons and clinics with PPR-certified Coach Sam Morris in Montgomery County, MD.
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

      {/* Meet Our Coaches */}
      <section id="coaches" className="py-16 px-6 scroll-mt-28">
        <div className="mx-auto max-w-4xl">
          <AnimateOnScroll>
            <h2 className="font-heading text-2xl md:text-3xl mb-8">About Coach Sam</h2>
            <div className="grid grid-cols-1 gap-6 max-w-2xl mx-auto">
              {COACHES.map((coach) => (
                <div
                  key={coach.name}
                  className="card-sm p-6"
                  style={{ borderLeft: `4px solid ${coach.color}` }}
                >
                  {coach.isHead && (
                    <div className="flex items-center gap-3 mb-3">
                      <Image
                        src="/images/sam-portrait-arms-crossed.jpg"
                        alt="Sam Morris"
                        width={56}
                        height={56}
                        className="rounded-full object-cover w-14 h-14"
                      />
                      <div>
                        <h3 className="font-heading font-bold text-lg">{coach.name}</h3>
                        <p className="text-text-muted text-sm">{coach.role}</p>
                      </div>
                    </div>
                  )}
                  {!coach.isHead && (
                    <>
                      <h3 className="font-heading font-bold text-lg mb-1">{coach.name}</h3>
                      <p className="text-text-muted text-sm mb-3">{coach.role}</p>
                    </>
                  )}
                  {coach.bio && <p className="text-text-muted text-xs mb-3 leading-relaxed">{coach.bio}</p>}
                  <div className="space-y-1 text-sm">
                    {coach.email && (
                      <a href={`mailto:${coach.email}`} className="block text-[#4DACD0] hover:text-[#3b82f6] transition-colors">{coach.email}</a>
                    )}
                    {coach.phone && (
                      <p className="text-text-muted">{coach.phone}</p>
                    )}
                    {coach.link && (
                      <a href={coach.link} target="_blank" rel="noopener noreferrer" className="block text-[#4DACD0] hover:text-[#3b82f6] transition-colors">{coach.linkLabel} &rarr;</a>
                    )}
                  </div>
                </div>
              ))}
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
              <li><strong className="text-text-primary">Book a single lesson</strong> to try out coaching</li>
              <li><strong className="text-text-primary">Pick up the 4-pack</strong> for the best per-session rate</li>
              <li><strong className="text-text-primary">Schedule your sessions</strong> after purchase</li>
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

      <RelatedPrograms currentPath="/programs/coaching" />

      {/* Bottom Nav */}
      <section className="py-12 px-6">
        <div className="mx-auto max-w-3xl flex justify-end items-center">
          <TrackedExternalLink href="https://tournamentwebsite.vercel.app/" label="Tournaments" page="coaching" className="text-[#4DACD0] hover:text-[#3b82f6] transition-colors font-semibold text-sm">
            Tournaments &rarr;
          </TrackedExternalLink>
        </div>
      </section>
    </div>
  );
}
