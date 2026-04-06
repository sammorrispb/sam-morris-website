import type { Metadata } from "next";
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
    <main className="min-h-screen pt-28 pb-20">
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
            about: {
              "@type": "Thing",
              name: "Pickleball",
            },
          }),
        }}
      />

      <section className="px-6">
        <div className="mx-auto max-w-4xl text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-text-primary mb-4">
            What&apos;s Your Pickleball Level?
          </h1>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">
            Find your skill level and discover the perfect programs for your game.
          </p>
        </div>

        <div className="mx-auto max-w-4xl">
          <QuizClient />
        </div>
      </section>
    </main>
  );
}
