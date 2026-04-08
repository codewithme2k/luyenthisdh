import { Course, Lecture, Lesson, Subject } from "@/generated/prisma/client";
import { Session } from "next-auth";

export type lectureList = (Lecture & { Lessons: Lesson[] })[];

export type SubjectWithCourseCount = Subject & {
  _count: {
    Course: number;
  };
};

export type AuthUser = Session["user"];

export type LectureWithLessons = Lecture & {
  Lessons: Lesson[];
};

export type CourseFullDetails = Course & {
  Lectures: LectureWithLessons[];
};
