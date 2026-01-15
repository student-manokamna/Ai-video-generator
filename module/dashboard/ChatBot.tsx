"use client";

import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupTextarea,
} from "@/components/ui/input-group";
import React, { useState } from "react";
import type { Course } from "@/module/course/types/course.types";
import { motion, AnimatePresence } from "motion/react";
import { IconSparkles, IconPlayerPlay, IconBook, IconArrowRight } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

const SUGGESTIONS = [
    { label: "Python for Data Science", icon: "🐍" },
    { label: "React Native Basics", icon: "📱" },
    { label: "Digital Marketing 101", icon: "📈" },
    { label: "UX Design Principles", icon: "🎨" },
];

const ChatBot = () => {
    const [topic, setTopic] = useState("");
    const [loading, setLoading] = useState(false);
    const [course, setCourse] = useState<Course | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (customTopic?: string) => {
        const searchTopic = customTopic || topic;
        if (!searchTopic.trim()) {
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
                body: JSON.stringify({ topic: searchTopic }),
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || "Failed to generate course");
            }

            setCourse(data.course);
            if (!customTopic) setTopic("");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-8 py-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-2"
            >
                <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 text-sm text-neutral-600 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
                    <IconSparkles className="h-4 w-4 text-amber-500" />
                    <span>AI-Powered Learning</span>
                </div>
                <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                    What do you want to <br />
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
                        learn today?
                    </span>
                </h1>
                <p className="text-lg text-neutral-600 dark:text-neutral-400">
                    Generate comprehensive video courses in seconds.
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="w-full max-w-xl"
            >
                <div className="relative group">
                    <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 opacity-20 blur transition duration-500 group-hover:opacity-40" />
                    <InputGroup className="bg-white dark:bg-neutral-900 shadow-xl border-neutral-200 dark:border-neutral-800 relative z-10">
                        <InputGroupTextarea
                            className="field-sizing-content flex min-h-[60px] w-full resize-none bg-transparent px-4 py-3 text-lg outline-none placeholder:text-neutral-400 dark:placeholder:text-neutral-600"
                            placeholder="Describe your learning goal..."
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            disabled={loading}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit();
                                }
                            }}
                        />
                        <InputGroupAddon align="block-end" className="px-3 pb-3">
                            <InputGroupButton
                                className={cn(
                                    "ml-auto rounded-full px-6 transition-all",
                                    loading ? "bg-neutral-100 text-neutral-400" : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg"
                                )}
                                onClick={() => handleSubmit()}
                                disabled={loading || !topic.trim()}
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                        <span>Designing...</span>
                                    </div>
                                ) : (
                                    <>
                                        Generate Course <IconArrowRight className="ml-1 h-4 w-4" />
                                    </>
                                )}
                            </InputGroupButton>
                        </InputGroupAddon>
                    </InputGroup>
                </div>

                {!course && !loading && (
                    <div className="mt-8">
                        <p className="mb-4 text-center text-sm font-medium text-neutral-500 dark:text-neutral-400">
                            Or try one of these suggestions:
                        </p>
                        <div className="flex flex-wrap justify-center gap-2">
                            {SUGGESTIONS.map((suggestion, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        setTopic(suggestion.label);
                                        handleSubmit(suggestion.label);
                                    }}
                                    className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-600 transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-blue-900 dark:hover:bg-blue-900/20"
                                >
                                    <span>{suggestion.icon}</span>
                                    <span>{suggestion.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </motion.div>

            <AnimatePresence mode="wait">
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400"
                    >
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {course && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-4xl"
                    >
                        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
                            {/* Course Header */}
                            <div className="border-b border-neutral-100 bg-neutral-50/50 p-8 dark:border-neutral-800 dark:bg-neutral-800/50">
                                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                    <div>
                                        <div className="mb-2 flex items-center gap-2">
                                            <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-900/30 dark:text-blue-300">
                                                {course.level}
                                            </span>
                                        </div>
                                        <h2 className="text-3xl font-bold text-neutral-900 dark:text-white">
                                            {course.courseName}
                                        </h2>
                                        <p className="mt-2 text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl">
                                            {course.courseDescription}
                                        </p>
                                    </div>
                                    <div className="flex shrink-0 items-center justify-center rounded-xl bg-blue-100 p-4 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                        <IconBook className="h-8 w-8" />
                                    </div>
                                </div>
                            </div>

                            {/* Chapters Grid */}
                            <div className="p-8">
                                <h3 className="mb-6 text-lg font-semibold text-neutral-900 dark:text-white">
                                    Course Curriculum ({course.totalChapters} Chapters)
                                </h3>
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {course.chapters.map((chapter, idx) => (
                                        <motion.a
                                            key={chapter.chapterId}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            href={`/course/${course.courseId}/chapter/${chapter.chapterId}`}
                                            className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-neutral-200 bg-white p-6 transition-all hover:border-blue-500 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-blue-500"
                                        >
                                            <div>
                                                <div className="mb-4 flex items-center justify-between">
                                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-sm font-semibold text-neutral-600 group-hover:bg-blue-100 group-hover:text-blue-600 dark:bg-neutral-800 dark:text-neutral-400 dark:group-hover:bg-blue-900/30 dark:group-hover:text-blue-400 transition-colors">
                                                        {idx + 1}
                                                    </span>
                                                    <IconPlayerPlay className="h-5 w-5 text-neutral-400 opacity-0 transition-opacity group-hover:opacity-100 text-blue-500" />
                                                </div>
                                                <h4 className="mb-2 font-semibold text-neutral-900 group-hover:text-blue-600 transition-colors dark:text-white dark:group-hover:text-blue-400">
                                                    {chapter.chapterTitle}
                                                </h4>
                                                <ul className="space-y-1">
                                                    {chapter.subContent.slice(0, 2).map((item, i) => (
                                                        <li key={i} className="flex items-start gap-2 text-sm text-neutral-500 dark:text-neutral-400">
                                                            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-neutral-300 dark:bg-neutral-600" />
                                                            <span className="line-clamp-1">{item}</span>
                                                        </li>
                                                    ))}
                                                    {chapter.subContent.length > 2 && (
                                                        <li className="text-xs text-neutral-400 pl-3">
                                                            +{chapter.subContent.length - 2} more topics
                                                        </li>
                                                    )}
                                                </ul>
                                            </div>
                                            <div className="mt-4 flex items-center text-sm font-medium text-blue-600 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1 dark:text-blue-400">
                                                Start Chapter <IconArrowRight className="ml-1 h-3 w-3" />
                                            </div>
                                        </motion.a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ChatBot;
