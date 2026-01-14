import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export default async function CourseOverviewPage({
    params,
}: {
    params: Promise<{ courseId: string }>;
}) {
    const { courseId } = await params;
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        redirect("/login");
    }

    const course = await prisma.course.findUnique({
        where: {
            courseId: courseId,
        },
        include: {
            chapters: {
                orderBy: {
                    createdAt: "asc", // or by some index if you have one
                },
                include: {
                    slides: true
                }
            },
        },
    });

    if (!course) {
        return notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8 dark:bg-neutral-900">
            <div className="mx-auto max-w-4xl">
                <Link
                    href="/profile"
                    className="mb-6 inline-flex items-center text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                    ← Back to Profile
                </Link>

                <div className="mb-8 rounded-2xl bg-white p-8 shadow-sm dark:bg-neutral-800">
                    <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
                        {course.courseName}
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        {course.courseDescription}
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                            {course.level}
                        </span>
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                            {course.chapters.length} Chapters
                        </span>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Course Content
                    </h2>
                    <div className="grid gap-4">
                        {course.chapters.map((chapter, index) => (
                            <Link
                                key={chapter.id}
                                href={`/course/${course.courseId}/chapter/${chapter.chapterId}`}
                                className="group flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-blue-500 hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-blue-500"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600 dark:bg-neutral-700 dark:text-gray-400 dark:group-hover:bg-blue-900/30 dark:group-hover:text-blue-400">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                                            {chapter.chapterTitle}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {chapter.slides.length > 0 ? `${chapter.slides.length} Slides` : "Not started"}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-gray-400 group-hover:text-blue-600 dark:text-gray-500 dark:group-hover:text-blue-400">
                                    →
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
