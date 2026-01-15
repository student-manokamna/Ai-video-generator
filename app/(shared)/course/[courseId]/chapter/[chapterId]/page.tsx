"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "motion/react";

import { IconCheck, IconChevronRight, IconPlayerPlay, IconNotes } from "@tabler/icons-react";
import ReactMarkdown from "react-markdown";
import { Player } from "@remotion/player";
import { SlideComposition } from "@/remotion/SlideComposition";

type CourseDetail = {
    courseName: string;
    courseDescription: string;
    chapters: {
        id: string;
        chapterId: string;
        chapterTitle: string;
        videoUrl?: string;
        notes?: string;
        slides?: any[];
    }[];
};

export default function ChapterPage() {
    const params = useParams();
    const router = useRouter();
    const [course, setCourse] = useState<CourseDetail | null>(null);
    const [loading, setLoading] = useState(true);

    const courseId = params?.courseId as string;
    const chapterId = params?.chapterId as string;

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                // Fetch course details - we might need a dedicated endpoint for single course
                // using the queries logic or a new endpoint. 
                // For now reusing /api/courses and filtering (lazy mock for now, ideally specific endpoint)
                const res = await fetch("/api/courses");
                if (res.ok) {
                    const data = await res.json();
                    const foundCourse = data.find((c: any) => c.courseId === courseId);
                    if (foundCourse) setCourse(foundCourse);
                }
            } catch (error) {
                console.error("Failed to load course", error);
            } finally {
                setLoading(false);
            }
        };

        if (courseId) fetchCourse();
    }, [courseId]);

    if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
    if (!course) return <div className="flex h-screen items-center justify-center">Course not found</div>;

    const currentChapter = course.chapters.find((c) => c.chapterId === chapterId);

    if (!currentChapter) return <div className="flex h-screen items-center justify-center">Chapter not found</div>;

    return (
        <div className="flex bg-white dark:bg-black h-[calc(100vh-64px)] overflow-hidden">
            {/* Sidebar Navigation */}
            <div className="w-80 border-r border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/50 overflow-y-auto hidden md:block">
                <div className="p-6">
                    <h2 className="text-lg font-bold text-neutral-900 dark:text-white line-clamp-2">
                        {course.courseName}
                    </h2>
                    <p className="mt-2 text-xs text-neutral-500 line-clamp-2">{course.courseDescription}</p>
                </div>
                <div className="px-3">
                    {course.chapters.map((chapter, idx) => (
                        <button
                            key={chapter.chapterId}
                            onClick={() => router.push(`/course/${courseId}/chapter/${chapter.chapterId}`)}
                            className={`mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors ${chapter.chapterId === chapterId
                                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                                : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
                                }`}
                        >
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/50 text-xs font-medium border border-black/5 dark:bg-black/20 dark:border-white/10">
                                {idx + 1}
                            </span>
                            <span className="text-sm font-medium line-clamp-1">{chapter.chapterTitle}</span>
                            {chapter.chapterId === chapterId && (
                                <IconPlayerPlay className="ml-auto h-4 w-4" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-4xl mx-auto p-6 md:p-10">
                    <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">
                        {currentChapter.chapterTitle}
                    </h1>

                    {/* Remotion Video Player */}
                    <div className="aspect-video w-full overflow-hidden rounded-xl bg-neutral-900 shadow-lg relative group mb-8">
                        {currentChapter.slides && currentChapter.slides.length > 0 ? (
                            <Player
                                component={SlideComposition}
                                inputProps={{
                                    slides: currentChapter.slides.map((s: any) => ({
                                        title: s.title,
                                        subtitle: s.subtitle,
                                        narration: s.narration,
                                        audioFileName: s.audioFileName,
                                        durationInFrames: 30 * 10, // Default 10 seconds per slide for now
                                    })),
                                    fps: 30,
                                }}
                                durationInFrames={currentChapter.slides.length * 30 * 10}
                                fps={30}
                                compositionWidth={1920}
                                compositionHeight={1080}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                }}
                                controls
                            />
                        ) : (
                            <div className="h-full w-full flex flex-col items-center justify-center bg-neutral-100 dark:bg-neutral-800 text-neutral-400">
                                <IconPlayerPlay className="h-16 w-16 mb-4 opacity-20" />
                                <p>Video content is being generated...</p>
                                <p className="text-sm mt-2">Try refreshing in a minute</p>
                            </div>
                        )}
                    </div>

                    {/* Notes Section */}
                    {currentChapter.notes && (
                        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                            <div className="flex items-center gap-2 mb-4 text-blue-600 dark:text-blue-400">
                                <IconNotes className="h-5 w-5" />
                                <span className="font-semibold">Study Notes</span>
                            </div>
                            <div className="prose prose-neutral dark:prose-invert max-w-none prose-sm md:prose-base">
                                <ReactMarkdown>{currentChapter.notes}</ReactMarkdown>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
