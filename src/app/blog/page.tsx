import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getBlogPosts } from "@/lib/blog";
import { breadcrumbJsonLd } from "@/lib/seo";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Blog — Pickleball Tips, Strategy & Community",
  description:
    "Pickleball tips, drills, strategy guides, and community stories from Coach Sam Morris in Montgomery County, MD.",
  alternates: {
    canonical: "https://www.sammorrispb.com/blog",
  },
  openGraph: {
    title: "Blog — Pickleball Tips, Strategy & Community",
    description:
      "Pickleball tips, drills, strategy guides, and community stories from Coach Sam Morris.",
    url: "https://www.sammorrispb.com/blog",
    images: [
      {
        url: "/og?title=Blog&subtitle=Tips%2C%20Strategy%20%26%20Community%20Stories",
        width: 1200,
        height: 630,
        alt: "Sam Morris Pickleball Blog",
      },
    ],
  },
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <main className="relative min-h-screen pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", href: "/" },
              { name: "Blog", href: "/blog" },
            ])
          ),
        }}
      />

      {/* ─── Hero ─── */}
      <section className="relative section-photo-backdrop pt-32 pb-16 px-6">
        <div className="photo-bg">
          <Image
            src="/images/pickleball-history.jpeg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            aria-hidden="true"
          />
        </div>
        <div className="relative mx-auto max-w-4xl text-center">
          <p className="eyebrow mb-3">Coach&apos;s notes</p>
          <h1 className="text-5xl md:text-7xl font-heading font-black text-text-primary mb-5 leading-[0.95]">
            <span className="gradient-text-warm">Tips. Strategy.</span> Stories.
          </h1>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">
            Drills, strategy guides, and community stories from the court — written
            for players, parents, and coaches.
          </p>
        </div>
      </section>

      {/* ─── Posts ─── */}
      <section className="px-6 pt-8">
        <div className="mx-auto max-w-5xl">
          {posts.length === 0 ? (
            <div className="text-center py-16">
              <div className="glass-card-amber rounded-2xl p-12 max-w-lg mx-auto">
                <p className="text-text-primary text-xl font-heading font-bold mb-3">
                  Coming soon.
                </p>
                <p className="text-text-muted text-sm leading-relaxed">
                  Blog posts are on the way. In the meantime, follow{" "}
                  <a
                    href="https://instagram.com/sammorris.pb"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent-blue hover:underline font-semibold"
                  >
                    @sammorris.pb
                  </a>{" "}
                  for tips and updates.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 hover:border-accent-blue/45 transition-all card-hover bg-navy-light flex flex-col"
                >
                  {post.coverImage && (
                    <div className="aspect-video bg-white/5 overflow-hidden relative">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-light/85 via-navy-light/20 to-transparent" />
                    </div>
                  )}
                  <div className="p-7 flex-1 flex flex-col">
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.tags.map((tag) => (
                          <span key={tag} className="tag-pill">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <h2 className="text-xl font-heading font-bold text-text-primary group-hover:text-accent-blue transition-colors leading-snug">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="mt-3 text-text-muted text-sm leading-relaxed line-clamp-2 flex-1">
                        {post.excerpt}
                      </p>
                    )}
                    <p className="mt-4 text-text-muted text-xs uppercase tracking-[0.14em] font-mono">
                      {new Date(post.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
