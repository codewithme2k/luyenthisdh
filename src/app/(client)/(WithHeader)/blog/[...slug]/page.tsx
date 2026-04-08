import type { Author, Blog } from "contentlayer/generated";
import { allAuthors, allBlogs } from "contentlayer/generated";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDX_COMPONENTS } from "@/components/mdx";
import { MDXLayoutRenderer } from "@/components/mdx/layout-renderer";

import { PostBanner } from "@/components/blog/layouts/post-banner";
import { PostLayout } from "@/components/blog/layouts/post-layout";
import { PostSimple } from "@/components/blog/layouts/post-simple";
import { allCoreContent, coreContent } from "@/utils/contentlayer";
import { sortPosts } from "@/utils/misc";
import { SITE_METADATA } from "@/shared/site-metadata";
import { CheckMemberShip } from "@/shared/actions/membership";
import Link from "next/link";

const DEFAULT_LAYOUT = "PostLayout" as const;
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
  const post = allBlogs.find((p) => p.slug === slug);
  const authorList = post?.authors || ["default"];
  const authorDetails = authorList.map((author) => {
    const authorResults = allAuthors.find((p) => p.slug === author);
    return coreContent(authorResults as Author);
  });
  if (!post) {
    return;
  }

  const publishedAt = new Date(post.date).toISOString();
  const modifiedAt = new Date(post.lastmod || post.date).toISOString();
  const authors = authorDetails.map((author) => author.name);
  let imageList = [SITE_METADATA.socialBanner];
  if (post.images) {
    imageList = typeof post.images === "string" ? [post.images] : post.images;
  }
  const ogImages = imageList.map((img) => {
    return {
      url: img.includes("http") ? img : SITE_METADATA.siteUrl + img,
    };
  });

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
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
      title: post.title,
      description: post.summary,
      images: imageList,
    },
  };
}

export const generateStaticParams = async () => {
  return allBlogs.map((p) => ({
    slug: p.slug.split("/").map((name) => decodeURI(name)),
  }));
};

export default async function Page(props: {
  params: Promise<{ slug: string[] }>;
}) {
  const params = await props.params;
  const slug = decodeURI(params.slug.join("/"));
  const sortedCoreContents = allCoreContent(sortPosts(allBlogs));
  const postIndex = sortedCoreContents.findIndex((p) => p.slug === slug);
  if (postIndex === -1) {
    return notFound();
  }
  const res = await CheckMemberShip();
  const isVip = res.success && res.plan && !res.isExpired;
  const prev = sortedCoreContents[postIndex + 1];
  const next = sortedCoreContents[postIndex - 1];
  const post = allBlogs.find((p) => p.slug === slug) as Blog;
  const authorList = post?.authors || ["default"];
  const authorDetails = authorList.map((author) => {
    const authorResults = allAuthors.find((p) => p.slug === author);
    return coreContent(authorResults as Author);
  });
  const mainContent = coreContent(post);
  const jsonLd = post.structuredData;
  jsonLd["author"] = authorDetails.map((author) => {
    return {
      "@type": "Person",
      name: author.name,
    };
  });
  const Layout =
    LAYOUTS[(post.layout || DEFAULT_LAYOUT) as keyof typeof LAYOUTS];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Layout
        content={mainContent}
        authorDetails={authorDetails}
        next={next}
        prev={prev}
      >
        {post.isVip && !isVip ? (
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
          <MDXLayoutRenderer
            code={post.body.code}
            components={MDX_COMPONENTS}
            toc={post.toc}
          />
        )}
      </Layout>
    </>
  );
}
