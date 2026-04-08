import type { Author, Tool } from "contentlayer/generated";
import { allAuthors, allTools } from "contentlayer/generated";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { allCoreContent, coreContent } from "@/utils/contentlayer";
import { sortPosts } from "@/utils/misc";
import { PostSimple } from "@/components/blog/layouts/post-simple";
import { PostLayout } from "@/components/blog/layouts/post-layout";
import { PostBanner } from "@/components/blog/layouts/post-banner";
import { SITE_METADATA } from "@/shared/site-metadata";
import { MDXLayoutRenderer } from "@/components/mdx/layout-renderer";
import { MDX_COMPONENTS } from "@/components/mdx";
import Link from "next/link";
import { CheckMemberShip } from "@/shared/actions/membership";

const DEFAULT_LAYOUT = "PostSimple";
const LAYOUTS = {
  PostSimple,
  PostLayout,
  PostBanner,
};

export async function generateMetadata(props: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata | undefined> {
  const params = await props.params;
  const slug = decodeURI(params.slug.join("/"));
  const tool = allTools.find((s) => s.slug === slug);
  const authorList = tool?.authors || ["default"];
  const authorDetails = authorList.map((author) => {
    const authorResults = allAuthors.find((p) => p.slug === author);
    return coreContent(authorResults as Author);
  });
  if (!tool) {
    return;
  }

  const publishedAt = new Date(tool.date).toISOString();
  const modifiedAt = new Date(tool.lastmod || tool.date).toISOString();
  const authors = authorDetails.map((author) => author.name);
  let imageList = [SITE_METADATA.socialBanner];
  if (tool.images) {
    imageList = typeof tool.images === "string" ? [tool.images] : tool.images;
  }
  const ogImages = imageList.map((img) => {
    return {
      url: img.includes("http") ? img : SITE_METADATA.siteUrl + img,
    };
  });

  return {
    title: tool.title,
    description: tool.summary,
    openGraph: {
      title: tool.title,
      description: tool.summary,
      siteName: SITE_METADATA.title,
      locale: "en_US",
      type: "article",
      publishedTime: publishedAt,
      modifiedTime: modifiedAt,
      url: "./",
      images: ogImages,
      authors: authors.length > 0 ? authors : [SITE_METADATA.author],
    },
    twitter: {
      card: "summary_large_image",
      title: tool.title,
      description: tool.summary,
      images: imageList,
    },
  };
}

export const generateStaticParams = async () => {
  return allTools.map((s) => ({
    slug: s.slug.split("/").map((name) => decodeURI(name)),
  }));
};

export default async function Page(props: {
  params: Promise<{ slug: string[] }>;
}) {
  const params = await props.params;
  const slug = decodeURI(params.slug.join("/"));
  const sortedCoreContents = allCoreContent(sortPosts(allTools));
  const toolIndex = sortedCoreContents.findIndex((p) => p.slug === slug);
  if (toolIndex === -1) {
    return notFound();
  }
  const res = await CheckMemberShip();
  const isVip = res.success && res.plan && !res.isExpired;
  const prev = sortedCoreContents[toolIndex + 1];
  const next = sortedCoreContents[toolIndex - 1];
  const tool = allTools.find((p) => p.slug === slug) as Tool;
  const authorList = tool?.authors || ["default"];
  const authorDetails = authorList.map((author) => {
    const authorResults = allAuthors.find((p) => p.slug === author);
    return coreContent(authorResults as Author);
  });
  const mainContent = coreContent(tool);
  const jsonLd = tool.structuredData;
  jsonLd.author = authorDetails.map((author) => {
    return {
      "@type": "Person",
      name: author.name,
    };
  });

  const Layout =
    LAYOUTS[(tool.layout as keyof typeof LAYOUTS) || DEFAULT_LAYOUT];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Layout
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        content={mainContent as any}
        authorDetails={authorDetails}
        next={next}
        prev={prev}
      >
        {tool.isVip && !isVip ? (
          <div className="rounded-3xl border border-blue-200 bg-blue-50/30 p-8 text-center dark:border-blue-900/30 dark:bg-blue-950/20 backdrop-blur-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400 shadow-inner">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-black text-blue-900 dark:text-blue-300 uppercase tracking-tight">
              Nội dung giới hạn cho Hội viên VIP
            </h3>
            <p className="mt-2 text-sm text-blue-800/80 dark:text-white max-w-sm mx-auto leading-relaxed">
              Bài viết này chứa phác đồ chuyên sâu và dữ liệu lâm sàng quan
              trọng.
            </p>

            <Link
              href="/membership"
              className="group relative inline-flex items-center justify-center mt-8 overflow-hidden rounded-full bg-linear-to-r from-blue-600 to-indigo-700 px-10 py-4 text-sm font-black text-white no-underline shadow-[0_10px_25px_-5px_rgba(37,99,235,0.4)] transition-all hover:scale-105 hover:shadow-[0_15px_35px_-5px_rgba(37,99,235,0.5)] active:scale-95"
            >
              <span className="relative uppercase tracking-widest text-white">
                Nâng cấp ngay
              </span>
              <div className="absolute inset-0 flex h-full w-full justify-center transform-[skew(-15deg)_translateX(-100%)] group-hover:duration-1000 group-hover:transform-[skew(-15deg)_translateX(100%)">
                <div className="relative h-full w-12 bg-white/30" />
              </div>
            </Link>
          </div>
        ) : (
          /* NẾU LÀ BÀI THƯỜNG HOẶC ĐÃ LÀ VIP THÌ HIỆN NỘI DUNG */
          <MDXLayoutRenderer
            code={tool.body.code}
            components={MDX_COMPONENTS}
            toc={tool.toc}
          />
        )}
      </Layout>
    </>
  );
}
