import type { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";
import { BlogList } from "@/components/BlogList";

export const metadata: Metadata = {
  title: "Pickleball Coaching Blog — Tips, Strategy & Community",
  description:
    "Pickleball coaching tips, strategy guides, and community insights from Sam Morris — PPR-certified coach in Montgomery County, MD. Learn shot development, mental game, and how to improve your play.",
  alternates: {
    canonical: "https://www.sammorrispb.com/blog",
  },
  openGraph: {
    title: "Pickleball Blog — Coaching Tips & Strategy | Sam Morris",
    description:
      "Expert pickleball tips, coaching strategies, and community stories from Montgomery County, MD.",
    url: "https://www.sammorrispb.com/blog",
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <>
      {/* ─── Hero ─── */}
      <section className="relative py-24 md:py-32 px-6 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.08),transparent_70%)]">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="font-heading font-black text-5xl md:text-6xl mb-6">
            Blog
          </h1>
          <p className="text-text-muted text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Thoughts on coaching, parenting, entrepreneurship, and leadership.
          </p>
        </div>
      </section>

      <BlogList posts={posts} />
    </>
  );
}
