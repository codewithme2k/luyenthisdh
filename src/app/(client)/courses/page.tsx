// page.tsx
import { ECourseStatus } from "@/components/admin/course/EditCourse";
import ArticleList from "@/components/course";
import { Container } from "@/components/customs/Container";
import { PageHeader } from "@/components/customs/page-header";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { db } from "@/lib/prisma";

export default async function page() {
  const [courses, subjects] = await Promise.all([
    db.course.findMany({
      where: { status: ECourseStatus.PUBLISHED },
      orderBy: { createdAt: "desc" },
    }),
    db.subject.findMany(),
  ]);

  return (
    <>
      <Header />

      <Container as="div" className="space-y-6 pt-4 md:space-y-24 lg:pt-12">
        <PageHeader
          title="Courses"
          description="Các khoá học và bài tập được thiết kế để giúp bạn nắm vững kiến thức y khoa một cách hiệu quả."
          className="border-b border-gray-200 dark:border-gray-700"
        />
        <ArticleList
          initialData={JSON.parse(JSON.stringify(courses))}
          subjects={JSON.parse(JSON.stringify(subjects))}
        />
      </Container>
      <Footer />
    </>
  );
}
