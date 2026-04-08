import { Container } from "@/components/customs/Container";
import Banner from "@/components/home/Banner";
import BlogSection from "@/components/home/Blog";
import Course from "@/components/home/Course";
import Features from "@/components/home/Features";
import { sortPosts } from "@/utils/misc";
import { allBlogs, allTools } from "contentlayer/generated";
import { allCoreContent } from "@/utils/contentlayer";

export default function Home() {
  const MAX_POSTS_DISPLAY = 3;
  const MAX_TOOLS_DISPLAY = 4;
  return (
    <>
      <Container as="div" className="space-y-6 pt-4 md:space-y-24 lg:pt-12">
        <Banner />
        <Features />
        <Course />
        <BlogSection
          posts={allCoreContent(sortPosts(allBlogs)).slice(
            0,
            MAX_POSTS_DISPLAY,
          )}
          tools={allCoreContent(sortPosts(allTools)).slice(
            0,
            MAX_TOOLS_DISPLAY,
          )}
        />
      </Container>
    </>
  );
}
