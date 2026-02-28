import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import Link from "next/link";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `https://www.sammorrispb.com/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://www.sammorrispb.com/blog/${slug}`,
      type: "article",
      publishedTime: post.date,
      authors: ["Sam Morris"],
      tags: [post.category, "pickleball", "Montgomery County MD"],
    },
    twitter: {
      card: "summary",
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="py-20 px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.excerpt,
            datePublished: post.date,
            author: {
              "@type": "Person",
              name: "Sam Morris",
              url: "https://www.sammorrispb.com",
            },
            publisher: {
              "@type": "Person",
              name: "Sam Morris",
              url: "https://www.sammorrispb.com",
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `https://www.sammorrispb.com/blog/${slug}`,
            },
          }),
        }}
      />
      <div className="max-w-3xl mx-auto">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-text-muted hover:text-accent-blue transition-colors text-sm mb-6"
        >
          &larr; Back to Blog
        </Link>
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-accent-blue/10 text-accent-blue">
              {post.category}
            </span>
            <span className="text-text-muted text-xs">{post.date}</span>
            <span className="text-text-muted text-xs">{post.readingTime}</span>
          </div>
          <h1 className="font-heading font-bold text-4xl">
            {post.title}
          </h1>
        </div>

        <div className="prose prose-invert prose-lg max-w-none prose-headings:font-heading prose-headings:font-bold prose-a:text-accent-blue">
          <MDXRemote source={post.content} />
        </div>
      </div>
    </article>
  );
}
