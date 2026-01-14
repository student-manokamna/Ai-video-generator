import ChapterPage from "@/module/course/components/ChapterPage";
import prisma from "@/lib/db";
import { notFound } from "next/navigation";

export default async function Page({
    params,
}: {
    params: Promise<{ courseId: string; chapterId: string }>;
}) {
    // Await params in Next.js 15
    const { courseId, chapterId } = await params;

    const chapter = await prisma.chapter.findFirst({
        where: {
            chapterId: chapterId,
            course: {
                courseId: courseId
            }
        },
        include: {
            slides: {
                orderBy: { slideIndex: "asc" },
            },
            course: true,
        },
    });

    if (!chapter) {
        notFound();
    }

    return (
        <ChapterPage
            courseId={courseId}
            chapterId={chapterId}
            chapter={{
                id: chapter.id,
                chapterTitle: chapter.chapterTitle,
                slides: chapter.slides,
            }}
            course={{
                id: chapter.course.id,
                courseName: chapter.course.courseName,
            }}
        />
    );
}
