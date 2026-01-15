"use client";

import { authClient } from "@/lib/auth-client";
import { IconMail, IconUser, IconCalendar, IconVideo } from "@tabler/icons-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { motion } from "motion/react";

export default function ProfilePage() {
    const [user, setUser] = useState<{
        name: string;
        email: string;
        image?: string;
        createdAt?: Date;
    } | null>(null);

    const [courseCount, setCourseCount] = useState(0);

    useEffect(() => {
        const fetchUserAndStats = async () => {
            const session = await authClient.getSession();
            if (session?.data?.user) {
                setUser({
                    name: session.data.user.name || "User",
                    email: session.data.user.email,
                    image: session.data.user.image || undefined,
                    createdAt: session.data.user.createdAt,
                });
            }

            // Fetch courses count
            try {
                const res = await fetch("/api/courses");
                if (res.ok) {
                    const courses = await res.json();
                    setCourseCount(courses.length);
                }
            } catch (error) {
                console.error("Failed to fetch stats", error);
            }
        };
        fetchUserAndStats();
    }, []);

    if (!user) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
            >
                <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
                <div className="px-8 pb-8">
                    <div className="relative -mt-16 mb-6 flex justify-between">
                        <div className="overflow-hidden rounded-full border-4 border-white dark:border-neutral-900">
                            {user.image ? (
                                <Image
                                    src={user.image}
                                    alt={user.name}
                                    width={128}
                                    height={128}
                                    className="h-32 w-32 object-cover"
                                />
                            ) : (
                                <div className="flex h-32 w-32 items-center justify-center bg-neutral-200 text-4xl font-bold dark:bg-neutral-800">
                                    {user.name[0].toUpperCase()}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
                            {user.name}
                        </h1>
                        <p className="text-neutral-500 dark:text-neutral-400">
                            Video Course Creator
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-4 rounded-xl border border-neutral-100 bg-neutral-50 p-6 dark:border-neutral-800 dark:bg-neutral-800/50">
                            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                                Contact Information
                            </h2>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-neutral-600 dark:text-neutral-300">
                                    <IconMail className="h-5 w-5 text-neutral-400" />
                                    <span>{user.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-neutral-600 dark:text-neutral-300">
                                    <IconCalendar className="h-5 w-5 text-neutral-400" />
                                    <span>
                                        Member since{" "}
                                        {user.createdAt
                                            ? new Date(user.createdAt).toLocaleDateString()
                                            : "N/A"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 rounded-xl border border-neutral-100 bg-neutral-50 p-6 dark:border-neutral-800 dark:bg-neutral-800/50">
                            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                                Statistics
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-neutral-800">
                                    <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                        <IconVideo className="h-5 w-5" />
                                    </div>
                                    <div className="text-2xl font-bold text-neutral-900 dark:text-white">
                                        {courseCount}
                                    </div>
                                    <div className="text-xs text-neutral-500 dark:text-neutral-400">
                                        Courses Generated
                                    </div>
                                </div>
                                <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-neutral-800">
                                    <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                                        <IconUser className="h-5 w-5" />
                                    </div>
                                    <div className="text-2xl font-bold text-neutral-900 dark:text-white">
                                        Free
                                    </div>
                                    <div className="text-xs text-neutral-500 dark:text-neutral-400">
                                        Current Plan
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
