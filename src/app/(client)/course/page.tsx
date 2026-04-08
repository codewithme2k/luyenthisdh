// page.tsx
import { ECourseStatus } from "@/components/admin/course/EditCourse";
import ArticleList from "@/components/course";
import { Container } from "@/components/customs/Container";
import { Header } from "@/components/header";
import db from "@/lib/prisma";

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

      <Container>
        <ArticleList
          initialData={JSON.parse(JSON.stringify(courses))}
          subjects={JSON.parse(JSON.stringify(subjects))}
        />
      </Container>
    </>
  );
}
