"use client";

import { Player } from "@remotion/player";
import { SlideComposition } from "@/remotion/SlideComposition";
import { useState } from "react";
import { useRouter } from "next/navigation";


interface Slide {
    id: string;
    title: string;
    subtitle: string | null;
    audioFileName: string | null;
    narration: string;
}

interface Chapter {
    id: string;
    chapterTitle: string;
    slides: Slide[];
}

interface Course {
    id: string;
    courseName: string;
}

export default function ChapterPage({
    courseId,
    chapterId,
    chapter,
    course,
}: {
    courseId: string;
    chapterId: string;
    chapter: Chapter;
    course: Course;
}) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const handleGenerateVideo = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `/api/course/${courseId}/chapter/${chapterId}/generate-video`,
                {
                    method: "POST",
                }
            );

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || "Failed to generate video");
            }

            // Reload page to show generated slides
           router.refresh(); 
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const hasSlides = chapter.slides && chapter.slides.length > 0;
    const fps = 30;

    // Calculate duration for each slide based on word count (approx 150 words per minute / 2.5 words per second)
    const slidesWithDuration = chapter.slides.map((slide) => {
        const wordCount = slide.narration.split(" ").length;
        const durationInSeconds = Math.max(5, Math.ceil(wordCount / 2.5));
        return {
            ...slide,
            durationInFrames: durationInSeconds * fps,
        };
    });

    const totalDurationInFrames = hasSlides
        ? slidesWithDuration.reduce((acc, slide) => acc + slide.durationInFrames, 0)
        : 90;

    return (
        <div className="min-h-screen bg-gray-50 p-8 dark:bg-neutral-900">
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
                        {course.courseName}
                    </h1>
                    <h2 className="text-xl text-gray-600 dark:text-gray-400">
                        {chapter.chapterTitle}
                    </h2>
                </div>

                {/* Video Player or Generate Button */}
                {hasSlides ? (
                    <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-neutral-800">
                        <Player
                            component={SlideComposition}
                            inputProps={{
                                slides: slidesWithDuration.map((slide) => ({
                                    title: slide.title,
                                    subtitle: slide.subtitle || undefined,
                                    audioFileName: slide.audioFileName || undefined,
                                    narration: slide.narration,
                                    durationInFrames: slide.durationInFrames,
                                })),
                                fps,
                            }}
                            durationInFrames={totalDurationInFrames}
                            compositionWidth={1280}
                            compositionHeight={720}
                            fps={fps}
                            controls
                            style={{
                                width: "100%",
                                maxWidth: "1280px",
                                margin: "0 auto",
                            }}
                        />

                        <div className="mt-6">
                            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                                Slides ({chapter.slides.length})
                            </h3>
                            <div className="grid gap-4 md:grid-cols-2">
                                {chapter.slides.map((slide, index) => (
                                    <div
                                        key={slide.id}
                                        className="rounded-md border border-gray-200 p-4 dark:border-neutral-700"
                                    >
                                        <div className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Slide {index + 1}
                                        </div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white">
                                            {slide.title}
                                        </h4>
                                        {slide.subtitle && (
                                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                                {slide.subtitle}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="rounded-lg bg-white p-12 text-center shadow-lg dark:bg-neutral-800">
                        <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                            No video generated yet
                        </h3>
                        <p className="mb-6 text-gray-600 dark:text-gray-400">
                            Generate AI-powered video slides for this chapter with narration
                        </p>

                        {error && (
                            <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                                {error}
                            </div>
                        )}

                        <button
                            onClick={handleGenerateVideo}
                            disabled={loading}
                            className="rounded-md bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? "Generating..." : "Generate Video"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
