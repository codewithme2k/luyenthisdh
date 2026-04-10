import { genPageMetadata } from "@/app/seo";
import { AuthorLayout } from "@/components/blog/layouts/author-layout";
import { Twemoji } from "@/components/customs/twemoji";
import { MDXLayoutRenderer } from "@/components/mdx/layout-renderer";
import { coreContent } from "@/utils/contentlayer";
import type { Author } from "contentlayer/generated";
import { allAuthors } from "contentlayer/generated";

export const metadata = genPageMetadata({ title: "About" });

const components = {
  Twemoji,
};

export default function AboutPage() {
  const author = allAuthors.find((p) => p.slug === "default") as Author;
  const mainContent = coreContent(author);

  return (
    <AuthorLayout content={mainContent}>
      <MDXLayoutRenderer code={author.body.code} components={components} />
    </AuthorLayout>
  );
}
