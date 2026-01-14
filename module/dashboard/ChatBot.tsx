"use client";

import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupTextarea,
} from "@/components/ui/input-group";
import React, { useState } from "react";
import type { Course } from "@/module/course/types/course.types";

const ChatBot = () => {
    const [topic, setTopic] = useState("");
    const [loading, setLoading] = useState(false);
    const [course, setCourse] = useState<Course | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (!topic.trim()) {
            setError("Please enter a course topic");
            return;
        }

        setLoading(true);
        setError(null);
        setCourse(null);

        try {
            const response = await fetch("/api/course/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ topic }),
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || "Failed to generate course");
            }

            setCourse(data.course);
            setTopic("");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen flex-col items-center justify-center gap-6">
            <div className="text-2xl font-bold">
                Learn Smarter with{" "}
                <span className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                    AI Video Courses
                </span>
            </div>

            <div className="grid w-full max-w-sm gap-6">
                <InputGroup>
                    <InputGroupTextarea
                        data-slot="input-group-control"
                        className="field-sizing-content flex min-h-16 w-full resize-none rounded-md bg-transparent px-3 py-2.5 text-base outline-none transition-[color,box-shadow] md:text-sm"
                        placeholder="Enter course topic (e.g., 'Python for Beginners')..."
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        disabled={loading}
                    />
                    <InputGroupAddon align="block-end">
                        <InputGroupButton
                            className="ml-auto"
                            size="sm"
                            variant="default"
                            onClick={handleSubmit}
                            disabled={loading || !topic.trim()}
                        >
                            {loading ? "Generating..." : "Generate Course"}
                        </InputGroupButton>
                    </InputGroupAddon>
                </InputGroup>

                {error && (
                    <div className="rounded-md bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                        {error}
                    </div>
                )}

                {course && (
                    <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
                        <h3 className="mb-2 text-xl font-bold">{course.courseName}</h3>
                        <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
                            {course.courseDescription}
                        </p>
                        <div className="mb-4 flex items-center gap-4 text-sm">
                            <span className="rounded-full bg-blue-100 px-3 py-1 font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                {course.level}
                            </span>
                            <span className="text-neutral-600 dark:text-neutral-400">
                                {course.totalChapters} Chapters
                            </span>
                        </div>

                        <div className="space-y-4">
                            {course.chapters.map((chapter, idx) => (
                                <a
                                    key={chapter.chapterId}
                                    href={`/course/${course.courseId}/chapter/${chapter.chapterId}`}
                                    className="block rounded-md border border-neutral-200 p-4 transition-all hover:border-blue-500 hover:shadow-md dark:border-neutral-700 dark:hover:border-blue-500"
                                >
                                    <h4 className="mb-2 font-semibold">
                                        Chapter {idx + 1}: {chapter.chapterTitle}
                                    </h4>
                                    <ul className="list-inside list-disc space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
                                        {chapter.subContent.map((item, i) => (
                                            <li key={i}>{item}</li>
                                        ))}
                                    </ul>
                                    <div className="mt-3 text-sm font-medium text-blue-600 dark:text-blue-400">
                                        Click to view chapter →
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatBot;