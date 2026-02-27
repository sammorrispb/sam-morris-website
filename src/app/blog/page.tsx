import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Thoughts on coaching, parenting, entrepreneurship, and leadership from Sam Morris.",
};

const CATEGORIES = [
  "All",
  "Coaching",
  "Parenting",
  "Entrepreneurship",
  "Leadership",
];

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

      {/* ─── Category Filter Pills ─── */}
      <section className="px-6">
        <div className="mx-auto max-w-4xl flex flex-wrap gap-2 justify-center">
          {CATEGORIES.map((cat) => (
            <span
              key={cat}
              className="px-3 py-1 rounded-full text-xs font-medium border border-white/10 text-text-muted hover:border-accent-blue hover:text-accent-blue transition-colors cursor-pointer"
            >
              {cat}
            </span>
          ))}
        </div>
      </section>

      {/* ─── Post Cards ─── */}
      <section className="py-16 px-6">
        <div className="mx-auto max-w-4xl space-y-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block bg-navy-light glow-border glow-border-hover rounded-xl p-6 transition-all"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-accent-blue/10 text-accent-blue">
                  {post.category}
                </span>
                <span className="text-text-muted text-xs">{post.date}</span>
                <span className="text-text-muted text-xs">
                  {post.readingTime}
                </span>
              </div>
              <h2 className="font-heading font-bold text-xl mb-2">
                {post.title}
              </h2>
              <p className="text-text-muted text-sm">{post.excerpt}</p>
            </Link>
          ))}

          {posts.length === 0 && (
            <p className="text-text-muted text-center py-12">
              Posts coming soon.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
