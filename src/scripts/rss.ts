import { writeFileSync } from "node:fs";
import { SITE_METADATA } from "@/shared/site-metadata";
import { sortPosts } from "@/utils/misc";
import { allBlogs, allTools } from ".contentlayer/generated/index.mjs";
import { Blog, Tool } from "contentlayer/generated";

type EnhancedItem = (Blog | Tool) & { subPath: string };

const blogs = allBlogs as unknown as Blog[];
const snippets = allTools as unknown as Tool[];
const RSS_PAGE = "feed.xml";

function escapeXml(unsafe: string): string {
  if (!unsafe) return "";
  return unsafe.replace(/[<>&"']/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case '"':
        return "&quot;";
      case "'":
        return "&apos;";
      default:
        return c;
    }
  });
}

function generateRssItem(item: EnhancedItem) {
  const { siteUrl, email, author } = SITE_METADATA;
  const itemUrl = `${siteUrl}/${item.subPath}/${item.slug}`;

  return `
    <item>
      <guid>${itemUrl}</guid>
      <title>${escapeXml(item.title)}</title>
      <link>${itemUrl}</link>
      ${item.summary ? `<description><![CDATA[${item.summary}]]></description>` : ""}
      <pubDate>${new Date(item.date).toUTCString()}</pubDate>
      <author>${email} (${author})</author>
      ${item.tags?.map((t) => `<category>${escapeXml(t)}</category>`).join("") || ""}
    </item>
  `;
}

function generateRss(items: EnhancedItem[]) {
  const { title, siteUrl, description, language, email, author } =
    SITE_METADATA;

  return `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
      <channel>
        <title>${escapeXml(title)}</title>
        <link>${siteUrl}/blog</link>
        <description>${escapeXml(description)}</description>
        <language>${language || "vi"}</language>
        <managingEditor>${email} (${author})</managingEditor>
        <webMaster>${email} (${author})</webMaster>
        <lastBuildDate>${new Date(items[0]?.date || new Date()).toUTCString()}</lastBuildDate>
        <atom:link href="${siteUrl}/${RSS_PAGE}" rel="self" type="application/rss+xml"/>
        ${items.map((item) => generateRssItem(item)).join("")}
      </channel>
    </rss>
  `;
}

export async function generateRssFeed() {
  const publishPosts = blogs
    .filter((post) => post.draft !== true)
    .map((p) => ({ ...p, subPath: "blog" }) as EnhancedItem);

  const publishSnippets = snippets
    .filter((post) => post.draft !== true)
    .map((s) => ({ ...s, subPath: "tools" }) as EnhancedItem);

  const allItems = sortPosts([...publishPosts, ...publishSnippets]);

  if (allItems.length > 0) {
    const rss = generateRss(allItems);
    writeFileSync(`./public/${RSS_PAGE}`, rss);
    console.log(
      "🗒️ RSS feed generated: /public/feed.xml (Combined Blog & Tools)",
    );
  }
}
