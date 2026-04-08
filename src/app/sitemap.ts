import { SITE_METADATA } from "@/shared/site-metadata";
import { allBlogs, allTools } from "contentlayer/generated";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = SITE_METADATA.siteUrl;
  const blogRoutes = allBlogs
    .filter((p) => !p.draft)
    .map(({ path, lastmod, date }) => ({
      url: `${siteUrl}/${path}`,
      lastModified: lastmod || date,
    }));
  const toolRoutes = allTools
    .filter((s) => !s.draft)
    .map(({ path, lastmod, date }) => ({
      url: `${siteUrl}/tools/${path}`,
      lastModified: lastmod || date,
    }));

  const routes = [
    "",
    "blog",
    "tools",
    "projects",
    "about",
    "books",
    "movies",
    "tags",
  ].map((route) => ({
    url: `${siteUrl}/${route}`,
    lastModified: new Date().toISOString().split("T")[0],
  }));

  return [...routes, ...blogRoutes, ...toolRoutes];
}
