import { Container } from "@/components/customs/Container";
import Banner from "@/components/home/Banner";
import BlogSection from "@/components/home/Blog";
import CourseCard from "@/components/home/Course";
import Features from "@/components/home/Features";
import { sortPosts } from "@/utils/misc";
import { allBlogs, allTools } from "contentlayer/generated";
import { allCoreContent } from "@/utils/contentlayer";
import { db } from "@/lib/prisma";
import { ECourseStatus } from "@/generated/prisma";

export default async function Home() {
  const courses = await db.course.findMany({
    where: { status: ECourseStatus.PUBLISHED },
    take: 4,
    orderBy: { createdAt: "desc" },
  });
  const MAX_POSTS_DISPLAY = 3;
  const MAX_TOOLS_DISPLAY = 4;
  return (
    <>
      <Container as="div" className="space-y-6 pt-4 md:space-y-24 lg:pt-12">
        <Banner />
        <Features />
        <CourseCard courses={courses} />
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
