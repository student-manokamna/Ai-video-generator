"use client";

import React, { useEffect, useState } from "react";
import type { Course } from "@/module/course/types/course.types";
import { motion } from "motion/react";
import { IconBook, IconPlayerPlay, IconArrowRight, IconLoader } from "@tabler/icons-react";
import Link from "next/link";

const UserCourses = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await fetch("/api/courses");
                if (res.ok) {
                    const data = await res.json();
                    setCourses(data);
                }
            } catch (error) {
                console.error("Failed to fetch courses", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    if (loading) {
        return (
            <div className="flex w-full justify-center py-10">
                <IconLoader className="animate-spin text-neutral-400" />
            </div>
        );
    }

    if (courses.length === 0) {
        return (
            <div className="w-full max-w-4xl py-10">
                <h2 className="mb-6 text-2xl font-bold text-neutral-900 dark:text-white">
                    My Courses
                </h2>
                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-8 text-center dark:border-neutral-800 dark:bg-neutral-900/50">
                    <p className="text-neutral-500 dark:text-neutral-400">
                        You haven't generated any courses yet. Try entering a topic above!
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl py-10">
            <h2 className="mb-6 text-2xl font-bold text-neutral-900 dark:text-white">
                My Courses
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
                {courses.map((course, idx) => (
                    <motion.div
                        key={course.courseId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-neutral-200 bg-white p-6 transition-all hover:border-blue-500 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-blue-500"
                    >
                        <Link href={`/course/${course.courseId}/chapter/${course.chapters[0]?.chapterId}`} className="absolute inset-0 z-10" />
                        <div>
                            <div className="mb-4 flex items-center justify-between">
                                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-900/30 dark:text-blue-300">
                                    {course.level}
                                </span>
                                <IconBook className="h-5 w-5 text-neutral-400 opacity-0 transition-opacity group-hover:opacity-100 text-blue-500" />
                            </div>
                            <h3 className="mb-2 text-lg font-semibold text-neutral-900 group-hover:text-blue-600 transition-colors dark:text-white dark:group-hover:text-blue-400">
                                {course.courseName}
                            </h3>
                            <p className="line-clamp-2 text-sm text-neutral-500 dark:text-neutral-400">
                                {course.courseDescription}
                            </p>
                            <div className="mt-4 flex items-center gap-4 text-xs text-neutral-400">
                                <span>{course.totalChapters} Chapters</span>

                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm font-medium text-blue-600 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1 dark:text-blue-400">
                            Continue Learning <IconArrowRight className="ml-1 h-3 w-3" />
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default UserCourses;
