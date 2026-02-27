"use client";

import { useState } from "react";
import Link from "next/link";
import type { BlogPost } from "@/lib/blog";

const CATEGORIES = [
  "All",
  "Coaching",
  "Parenting",
  "Entrepreneurship",
  "Leadership",
] as const;

export function BlogList({ posts }: { posts: BlogPost[] }) {
  const [active, setActive] = useState<string>("All");

  const filtered =
    active === "All" ? posts : posts.filter((p) => p.category === active);

  return (
    <>
      {/* ─── Category Filter Pills ─── */}
      <section className="px-6">
        <div className="mx-auto max-w-4xl flex flex-wrap gap-2 justify-center">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActive(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                active === cat
                  ? "border-accent-blue text-accent-blue bg-accent-blue/10"
                  : "border-white/10 text-text-muted hover:border-accent-blue hover:text-accent-blue"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ─── Post Cards ─── */}
      <section className="py-16 px-6">
        <div className="mx-auto max-w-4xl space-y-6">
          {filtered.map((post) => (
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

          {filtered.length === 0 && (
            <p className="text-text-muted text-center py-12">
              No posts in this category yet.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
