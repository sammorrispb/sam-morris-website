import { Client } from "@notionhq/client";

const notion = process.env.NOTION_BLOG_DB_ID
  ? new Client({ auth: process.env.NOTION_API_KEY })
  : null;

const DATABASE_ID = process.env.NOTION_BLOG_DB_ID ?? "";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  date: string;
  tags: string[];
  coverImage: string | null;
  excerpt: string;
}

export interface BlogPostContent extends BlogPost {
  blocks: unknown[];
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  if (!notion || !DATABASE_ID) return [];

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await (notion as any).dataSources.query({
      data_source_id: DATABASE_ID,
      filter: {
        property: "Published",
        checkbox: { equals: true },
      },
      sorts: [{ property: "Date", direction: "descending" }],
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return response.results.map((page: any) => {
      const props = page.properties;
      return {
        id: page.id,
        slug: props.Slug?.rich_text?.[0]?.plain_text ?? page.id,
        title: props.Title?.title?.[0]?.plain_text ?? "Untitled",
        date: props.Date?.date?.start ?? "",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        tags: props.Tags?.multi_select?.map((t: any) => t.name) ?? [],
        coverImage: page.cover?.external?.url ?? page.cover?.file?.url ?? null,
        excerpt: props.Excerpt?.rich_text?.[0]?.plain_text ?? "",
      };
    });
  } catch (error) {
    console.error("Failed to fetch blog posts:", error);
    return [];
  }
}

export async function getBlogPost(slug: string): Promise<BlogPostContent | null> {
  if (!notion || !DATABASE_ID) return null;

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await (notion as any).dataSources.query({
      data_source_id: DATABASE_ID,
      filter: {
        and: [
          { property: "Slug", rich_text: { equals: slug } },
          { property: "Published", checkbox: { equals: true } },
        ],
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const page = response.results[0] as any;
    if (!page) return null;

    const blocks = await getNotionBlocks(page.id);
    const props = page.properties;

    return {
      id: page.id,
      slug,
      title: props.Title?.title?.[0]?.plain_text ?? "Untitled",
      date: props.Date?.date?.start ?? "",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tags: props.Tags?.multi_select?.map((t: any) => t.name) ?? [],
      coverImage: page.cover?.external?.url ?? page.cover?.file?.url ?? null,
      excerpt: props.Excerpt?.rich_text?.[0]?.plain_text ?? "",
      blocks,
    };
  } catch (error) {
    console.error("Failed to fetch blog post:", error);
    return null;
  }
}

async function getNotionBlocks(pageId: string): Promise<unknown[]> {
  if (!notion) return [];

  try {
    const blocks: unknown[] = [];
    let cursor: string | undefined;

    do {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await notion.blocks.children.list({
        block_id: pageId,
        start_cursor: cursor,
        page_size: 100,
      });
      blocks.push(...response.results);
      cursor = response.has_more ? response.next_cursor : undefined;
    } while (cursor);

    return blocks;
  } catch (error) {
    console.error("Failed to fetch blocks:", error);
    return [];
  }
}
