import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getBlogPost, getBlogPosts } from "@/lib/blog";
import { breadcrumbJsonLd } from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return { title: "Post Not Found" };

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `https://www.sammorrispb.com/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://www.sammorrispb.com/blog/${post.slug}`,
      type: "article",
      publishedTime: post.date,
      ...(post.coverImage && {
        images: [{ url: post.coverImage, width: 1200, height: 630, alt: post.title }],
      }),
    },
  };
}

// Notion block types vary widely; use a permissive record shape
// rather than pulling in @notionhq/client's union types.
type NotionBlock = { id?: string; type: string; [key: string]: unknown };
type NotionRichText = {
  plain_text: string;
  annotations: {
    bold?: boolean;
    italic?: boolean;
    code?: boolean;
    strikethrough?: boolean;
    underline?: boolean;
    color?: string;
  };
  href?: string | null;
};

function renderBlock(block: NotionBlock) {
  const type = block.type;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const value = block[type] as any;

  switch (type) {
    case "paragraph":
      return (
        <p className="text-text-primary leading-relaxed mb-4">
          {renderRichText(value.rich_text)}
        </p>
      );
    case "heading_1":
      return (
        <h1 className="text-3xl font-heading font-bold text-text-primary mt-8 mb-4">
          {renderRichText(value.rich_text)}
        </h1>
      );
    case "heading_2":
      return (
        <h2 className="text-2xl font-heading font-bold text-text-primary mt-6 mb-3">
          {renderRichText(value.rich_text)}
        </h2>
      );
    case "heading_3":
      return (
        <h3 className="text-xl font-heading font-semibold text-text-primary mt-5 mb-2">
          {renderRichText(value.rich_text)}
        </h3>
      );
    case "bulleted_list_item":
      return (
        <li className="text-text-primary leading-relaxed ml-6 list-disc">
          {renderRichText(value.rich_text)}
        </li>
      );
    case "numbered_list_item":
      return (
        <li className="text-text-primary leading-relaxed ml-6 list-decimal">
          {renderRichText(value.rich_text)}
        </li>
      );
    case "quote":
      return (
        <blockquote className="border-l-4 border-accent-blue pl-4 my-4 italic text-text-muted">
          {renderRichText(value.rich_text)}
        </blockquote>
      );
    case "code":
      return (
        <pre className="bg-white/5 rounded-lg p-4 my-4 overflow-x-auto">
          <code className="text-sm font-mono text-text-primary">
            {value.rich_text?.[0]?.plain_text}
          </code>
        </pre>
      );
    case "divider":
      return <hr className="border-white/10 my-8" />;
    case "image": {
      const src = value.external?.url ?? value.file?.url;
      const caption = value.caption?.[0]?.plain_text;
      return (
        <figure className="my-6">
          {src && (
            <img src={src} alt={caption ?? ""} className="rounded-lg w-full" />
          )}
          {caption && (
            <figcaption className="text-text-muted text-sm text-center mt-2">
              {caption}
            </figcaption>
          )}
        </figure>
      );
    }
    default:
      return null;
  }
}

function renderRichText(richText: NotionRichText[] | undefined) {
  if (!richText) return null;
  return richText.map((text: NotionRichText, i: number) => {
    let content: React.ReactNode = text.plain_text;

    if (text.annotations.bold) content = <strong key={i}>{content}</strong>;
    if (text.annotations.italic) content = <em key={i}>{content}</em>;
    if (text.annotations.code)
      content = (
        <code key={i} className="bg-white/10 px-1.5 py-0.5 rounded text-sm font-mono">
          {content}
        </code>
      );
    if (text.href)
      content = (
        <a
          key={i}
          href={text.href}
          className="text-accent-blue hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {content}
        </a>
      );

    return <span key={i}>{content}</span>;
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();

  return (
    <main className="min-h-screen pt-28 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", href: "/" },
              { name: "Blog", href: "/blog" },
              { name: post.title, href: `/blog/${post.slug}` },
            ])
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            datePublished: post.date,
            author: {
              "@type": "Person",
              name: "Sam Morris",
              url: "https://www.sammorrispb.com",
            },
            publisher: {
              "@type": "Organization",
              name: "Sam Morris Pickleball",
              url: "https://www.sammorrispb.com",
            },
            ...(post.coverImage && { image: post.coverImage }),
            description: post.excerpt,
          }),
        }}
      />

      <article className="px-6">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/blog"
            className="text-text-muted hover:text-text-primary text-sm transition-colors mb-8 inline-block"
          >
            &larr; Back to Blog
          </Link>

          <header className="mb-10">
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
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
            <h1 className="text-3xl md:text-5xl font-heading font-bold text-text-primary mb-4">
              {post.title}
            </h1>
            <p className="text-text-muted text-sm">
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </header>

          {post.coverImage && (
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full rounded-xl mb-10"
            />
          )}

          <div className="prose-invert max-w-none">
            {post.blocks.map((block: unknown, i: number) => {
              const b = block as NotionBlock;
              return <div key={b.id ?? i}>{renderBlock(b)}</div>;
            })}
          </div>
        </div>
      </article>
    </main>
  );
}
