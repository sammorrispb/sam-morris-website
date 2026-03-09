import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import matter from "gray-matter";

/* ── Types ── */

type SearchEntry = {
  title: string;
  description: string;
  url: string;
  type: "page" | "section" | "blog";
  category?: string;
};

/* ── Helpers ── */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const APP_DIR = path.join(ROOT, "src", "app");
const BLOG_DIR = path.join(ROOT, "content", "blog");
const OUT_FILE = path.join(ROOT, "public", "search-index.json");

/** Strip JSX tags and decode common HTML entities. */
function stripJsx(text: string): string {
  return text
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&mdash;/g, "\u2014")
    .replace(/&ndash;/g, "\u2013")
    .replace(/&apos;/g, "'")
    .replace(/&rsquo;/g, "\u2019")
    .replace(/&lsquo;/g, "\u2018")
    .replace(/&ldquo;/g, "\u201C")
    .replace(/&rdquo;/g, "\u201D")
    .replace(/&rarr;/g, "\u2192")
    .replace(/&larr;/g, "\u2190")
    .replace(/&reg;/g, "\u00AE")
    .replace(/&middot;/g, "\u00B7")
    .replace(/&quot;/g, '"')
    .replace(/\{[^}]*\}/g, "")
    .replace(/\s+/g, " ")
    .replace(/^[,\s]+|[,\s]+$/g, "")
    .replace(/,\s*,/g, ",")
    .trim();
}

/** Map a page file path to a URL path. */
function filePathToUrl(filePath: string): string {
  const rel = path.relative(APP_DIR, filePath);
  const dir = path.dirname(rel);
  if (dir === ".") return "/";
  return "/" + dir.replace(/\\/g, "/");
}

/** Recursively find all page.tsx files under a directory. */
function findPages(dir: string): string[] {
  const results: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Skip dynamic route segments like [slug]
      if (entry.name.startsWith("[")) continue;
      results.push(...findPages(full));
    } else if (entry.name === "page.tsx") {
      results.push(full);
    }
  }
  return results;
}

/* ── Page scanning ── */

function extractMetadata(
  source: string
): { title: string; description: string } | null {
  // Match the metadata export object literal
  const metaMatch = source.match(
    /export\s+const\s+metadata\s*:\s*Metadata\s*=\s*\{([\s\S]*?)^\};/m
  );
  if (!metaMatch) return null;

  const block = metaMatch[1];

  // Extract top-level title (not nested openGraph title)
  const titleMatch = block.match(
    /^\s+title:\s*(?:"([^"]+)"|'([^']+)'|`([^`]+)`)/m
  );
  // Extract top-level description
  const descMatch = block.match(
    /^\s+description:\s*\n?\s*(?:"([^"]+)"|'([^']+)'|`([^`]+)`)/m
  );

  const title = titleMatch
    ? (titleMatch[1] || titleMatch[2] || titleMatch[3])
    : null;
  const description = descMatch
    ? (descMatch[1] || descMatch[2] || descMatch[3])
    : null;

  if (!title || !description) return null;
  return { title, description };
}

function extractSections(
  source: string,
  pageUrl: string,
  pageTitle: string
): SearchEntry[] {
  const entries: SearchEntry[] = [];

  // Derive a category from the page title (first meaningful segment)
  const category = pageTitle.split(/\s*[—\-|]\s*/)[0].trim();

  // Find sections with id attributes and nearby h2/h3 headings
  const sectionRegex = /<section[^>]*\bid="([^"]+)"[^>]*>/g;
  let sectionMatch: RegExpExecArray | null;

  while ((sectionMatch = sectionRegex.exec(source)) !== null) {
    const sectionId = sectionMatch[1];
    const startIdx = sectionMatch.index;

    // Find the closing </section> for this section
    const rest = source.slice(startIdx);
    const closingIdx = rest.indexOf("</section>");
    const sectionContent = closingIdx > 0 ? rest.slice(0, closingIdx) : rest.slice(0, 2000);

    // Find the first <h2> or <h3> in this section
    const headingMatch = sectionContent.match(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/);
    if (!headingMatch) continue;

    const headingText = stripJsx(headingMatch[1]);
    if (!headingText) continue;

    // Build a description from the first <p> in this section; fall back to heading text
    const pMatch = sectionContent.match(/<p[^>]*>([\s\S]*?)<\/p>/);
    const pText = pMatch ? stripJsx(pMatch[1]).slice(0, 150) : "";
    const description = pText || headingText;

    // Prepend parent page name for generic/short titles to disambiguate
    const shortPageName = pageTitle.split(/\s*[—\-|]\s*/)[0].trim();
    const isGenericTitle = headingText.length <= 25 && !headingText.includes(" — ");
    const qualifiedTitle =
      isGenericTitle && shortPageName
        ? `${shortPageName} — ${headingText}`
        : headingText;

    entries.push({
      title: qualifiedTitle,
      description,
      url: `${pageUrl}#${sectionId}`,
      type: "section",
      category,
    });
  }

  return entries;
}

function scanPages(): SearchEntry[] {
  const entries: SearchEntry[] = [];
  const pages = findPages(APP_DIR);

  for (const pagePath of pages) {
    const url = filePathToUrl(pagePath);

    // Skip admin page
    if (url === "/admin") continue;

    const source = fs.readFileSync(pagePath, "utf-8");
    const meta = extractMetadata(source);

    if (meta) {
      entries.push({
        title: meta.title,
        description: meta.description,
        url,
        type: "page",
      });

      // Extract sections (skip for blog listing — no meaningful sections)
      if (url !== "/blog") {
        entries.push(...extractSections(source, url, meta.title));
      }
    }
  }

  return entries;
}

/* ── Blog scanning ── */

function scanBlog(): SearchEntry[] {
  const entries: SearchEntry[] = [];

  if (!fs.existsSync(BLOG_DIR)) return entries;

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));

  for (const file of files) {
    const filePath = path.join(BLOG_DIR, file);
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);

    const slug = file.replace(/\.mdx$/, "");
    const title = data.title || slug;
    const category = data.category || undefined;

    // Use excerpt from frontmatter, or first ~150 chars of content
    let description = data.excerpt || "";
    if (!description) {
      const plain = content
        .replace(/^#+\s.*$/gm, "")
        .replace(/\*\*([^*]+)\*\*/g, "$1")
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        .replace(/\n+/g, " ")
        .trim();
      description = plain.slice(0, 150);
      if (plain.length > 150) description += "...";
    }

    entries.push({
      title,
      description,
      url: `/blog/${slug}`,
      type: "blog",
      category,
    });
  }

  return entries;
}

/* ── Main ── */

const pageEntries = scanPages();
const blogEntries = scanBlog();
const index = [...pageEntries, ...blogEntries];

fs.writeFileSync(OUT_FILE, JSON.stringify(index, null, 2));
console.log(
  `Search index generated: ${index.length} entries (${pageEntries.filter((e) => e.type === "page").length} pages, ${pageEntries.filter((e) => e.type === "section").length} sections, ${blogEntries.length} blog posts)`
);
console.log(`Written to ${OUT_FILE}`);
