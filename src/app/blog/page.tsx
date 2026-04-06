import type { Metadata } from "next";
import Link from "next/link";
import { getBlogPosts } from "@/lib/blog";
import { breadcrumbJsonLd } from "@/lib/seo";

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
    <main className="min-h-screen pt-28 pb-20">
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

      <section className="px-6">
        <div className="mx-auto max-w-4xl text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-text-primary mb-4">
            Blog
          </h1>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">
            Tips, drills, strategy guides, and community stories from the court.
          </p>
        </div>

        <div className="mx-auto max-w-4xl">
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <div className="glow-border rounded-xl p-12 bg-white/[0.02] max-w-lg mx-auto">
                <p className="text-text-primary text-xl font-heading font-semibold mb-3">
                  Coming Soon
                </p>
                <p className="text-text-muted text-sm leading-relaxed">
                  Blog posts are on the way. In the meantime, follow{" "}
                  <a
                    href="https://instagram.com/sammorris.pb"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent-blue hover:underline"
                  >
                    @sammorris.pb
                  </a>{" "}
                  for tips and updates.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="glow-border rounded-xl overflow-hidden bg-white/[0.02] hover:bg-white/[0.05] transition-colors group"
                >
                  {post.coverImage && (
                    <div className="aspect-video bg-white/5 overflow-hidden">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-1 rounded-full bg-accent-blue/10 text-accent-blue"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <h2 className="text-lg font-heading font-semibold text-text-primary group-hover:text-accent-blue transition-colors">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="mt-2 text-text-muted text-sm leading-relaxed line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}
                    <p className="mt-3 text-text-muted text-xs">
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
