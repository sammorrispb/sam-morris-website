import type { Metadata } from "next";
import Image from "next/image";
import { QuizClient } from "@/components/QuizClient";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "What's Your Pickleball Level? — Free Skill Quiz",
  description:
    "Take our free 1-minute quiz to find out your pickleball skill level and get personalized program recommendations in Montgomery County, MD.",
  alternates: {
    canonical: "https://www.sammorrispb.com/quiz",
  },
  openGraph: {
    title: "What's Your Pickleball Level?",
    description:
      "Free 1-minute quiz — find your skill level and get personalized program recommendations.",
    url: "https://www.sammorrispb.com/quiz",
    images: [
      {
        url: "/og?title=What%27s%20Your%20Pickleball%20Level%3F&subtitle=Free%201-Minute%20Skill%20Quiz",
        width: 1200,
        height: 630,
        alt: "Pickleball Skill Level Quiz",
      },
    ],
  },
};

export default function QuizPage() {
  return (
    <main className="relative min-h-screen pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", href: "/" },
              { name: "Skill Quiz", href: "/quiz" },
            ])
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Quiz",
            name: "What's Your Pickleball Level?",
            description:
              "A 6-question assessment to determine your pickleball skill level and recommend the right programs.",
            educationalLevel: "beginner to advanced",
            about: { "@type": "Thing", name: "Pickleball" },
          }),
        }}
      />

      {/* Hero — photo backdrop */}
      <section className="relative section-photo-backdrop pt-32 pb-12 px-6">
        <div className="photo-bg">
          <Image
            src="/images/pickleballs-cluster.webp"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            aria-hidden="true"
          />
        </div>
        <div className="relative mx-auto max-w-4xl text-center">
          <p className="eyebrow mb-3">1-minute quiz</p>
          <h1 className="text-5xl md:text-7xl font-heading font-black text-text-primary mb-5 leading-[0.95]">
            What&apos;s your <span className="gradient-text-warm">pickleball level?</span>
          </h1>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">
            Six questions. Real recommendations. Find the perfect programs for your game.
          </p>
        </div>
      </section>

      <section className="px-6">
        <div className="mx-auto max-w-3xl">
          <div className="glass-card rounded-3xl p-8 md:p-12">
            <QuizClient />
          </div>
        </div>
      </section>
    </main>
  );
}
