"use client";

import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useCourseContent } from "@/shared/hooks/use-course-content";
import { useDragDrop } from "@/shared/hooks/use-drag-drop";
import { LectureEditForm } from "./LectureEditForm";
import { SortableLessonsContainer } from "./SortableLessonsContainer";
import { commonButtonClassName } from "@/shared/constants";

import { BookText, Pen, Trash2 } from "lucide-react";
import { lectureList } from "@/shared/types";
import Link from "next/link";
import { Course } from "@/generated/prisma/client";

interface CourseContentProps {
  data: Course & { Lectures: lectureList };
}

export default function CourseContent({ data }: CourseContentProps) {
  const {
    lectureList,
    editStates,
    setEditStates,
    isSubmitting,
    setIsSubmitting,
    handleAddLecture,
    handleDeleteLecture,
    handleAddLesson,
    handleDeleteLesson,
  } = useCourseContent(data);

  const { handleDragEnd } = useDragDrop(lectureList);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  return (
    <div className="container mx-auto pb-20 p-5">
      <div className="flex justify-between mb-8 items-center">
        <h2 className="font-bold text-xl max-w-[75%]">
          Outline khóa học: <span className="font-extrabold">{data.name}</span>
        </h2>
        <Button asChild>
          <Link href={`/admin/course/${data.slug}/upload`}>
            Upload nội dung
          </Link>
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        {lectureList.map((lecture) => (
          <div key={lecture.id}>
            {editStates.lectureId === lecture.id ? (
              <LectureEditForm
                lecture={lecture}
                courseSlug={data.slug}
                isSubmitting={isSubmitting.lecture}
                onCancel={() => setEditStates({ ...editStates, lectureId: "" })}
                onSubmitStart={() =>
                  setIsSubmitting((draft) => {
                    draft.lecture = true;
                  })
                }
                onSubmitEnd={() =>
                  setIsSubmitting((draft) => {
                    draft.lecture = false;
                  })
                }
              />
            ) : (
              <Accordion
                asChild
                type="single"
                collapsible
                className="w-full mb-5"
              >
                <AccordionItem value={lecture.id}>
                  <AccordionTrigger className="no-underline hover:no-underline focus:no-underline">
                    <div className="flex items-center gap-2 font-bold w-full">
                      <BookText size={20} className="text-primary" />
                      <p className="no-underline flex-1 text-left">
                        {lecture.title}
                      </p>

                      <div className="flex items-center gap-1 pl-2">
                        <div
                          role="button"
                          className="size-6 flex items-center justify-center hover:text-blue-500 hover:opacity-80 transition-colors"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setEditStates({
                              ...editStates,
                              lectureId: lecture.id,
                            });
                          }}
                        >
                          <Pen size={15} />
                        </div>
                        <div
                          role="button"
                          className="size-6 flex items-center justify-center hover:text-red-500 hover:opacity-80 transition-colors"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDeleteLecture(lecture.id);
                          }}
                        >
                          <Trash2 size={15} />
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="bg-transparent mt-5 flex flex-col">
                    <div className="max-h-125 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
                      <SortableLessonsContainer
                        lectureId={lecture.id}
                        Lessons={lecture.Lessons}
                        courseId={data.id}
                        courseSlug={data.slug}
                        lectureList={lectureList}
                        editingLessonId={editStates.lessonId}
                        isSubmitting={isSubmitting.lesson}
                        onEditLesson={(lessonId) =>
                          setEditStates({ ...editStates, lessonId })
                        }
                        onCancelEditLesson={() =>
                          setEditStates({ ...editStates, lessonId: "" })
                        }
                        onDeleteLesson={handleDeleteLesson}
                        onSubmitStart={() =>
                          setIsSubmitting((draft) => {
                            draft.lesson = true;
                          })
                        }
                        onSubmitEnd={() =>
                          setIsSubmitting((draft) => {
                            draft.lesson = false;
                          })
                        }
                      />
                    </div>

                    {/* KHU VỰC ĐƯỢC FIX: Đẩy nút thêm bài học xuống dưới cùng và tạo đường kẻ ngang */}
                    {editStates.lessonId === "" && (
                      <div className="pt-4 mt-2 border-t border-dashed">
                        <Button
                          className={cn("ml-auto w-fit flex")}
                          onClick={() => handleAddLesson(lecture.id)}
                          disabled={isSubmitting.lesson}
                        >
                          Thêm bài học
                        </Button>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </div>
        ))}
        <DragOverlay>{/* Add drag overlay content if needed */}</DragOverlay>
      </DndContext>

      {editStates.lectureId === "" && editStates.lessonId === "" && (
        <Button
          className={commonButtonClassName}
          onClick={handleAddLecture}
          disabled={isSubmitting.lecture}
        >
          Thêm chương
        </Button>
      )}
    </div>
  );
}
