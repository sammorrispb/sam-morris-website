import type { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";
import { BlogList } from "@/components/BlogList";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Thoughts on coaching, parenting, entrepreneurship, and leadership from Sam Morris.",
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
