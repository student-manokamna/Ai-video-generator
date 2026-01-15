"use client";

import { useTheme } from "next-themes";
import React, { useState } from "react";
import { motion } from "motion/react";
import { IconMoon, IconSun, IconTrash, IconBell } from "@tabler/icons-react";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
    const { setTheme, theme } = useTheme();
    const [emailNotifs, setEmailNotifs] = useState(true);
    const [mounted, setMounted] = useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null; // or a loading spinner
    }

    return (
        <div className="mx-auto max-w-4xl py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
                        Settings
                    </h1>
                    <p className="text-neutral-500 dark:text-neutral-400">
                        Manage your preferences and account settings.
                    </p>
                </div>

                {/* Appearance */}
                <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="border-b border-neutral-100 px-6 py-4 dark:border-neutral-800">
                        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                            Appearance
                        </h2>
                    </div>
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800">
                                    {theme === "dark" ? (
                                        <IconMoon className="h-5 w-5 text-neutral-500" />
                                    ) : (
                                        <IconSun className="h-5 w-5 text-neutral-500" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-medium text-neutral-900 dark:text-white">
                                        Dark Mode
                                    </h3>
                                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                        Switch between light and dark themes
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800">
                                <button
                                    onClick={() => setTheme("light")}
                                    className={`rounded-md px-3 py-1.5 text-sm font-medium transition-all ${theme === "light"
                                        ? "bg-white text-black shadow-sm dark:bg-neutral-700 dark:text-white"
                                        : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400"
                                        }`}
                                >
                                    Light
                                </button>
                                <button
                                    onClick={() => setTheme("dark")}
                                    className={`rounded-md px-3 py-1.5 text-sm font-medium transition-all ${theme === "dark"
                                        ? "bg-white text-black shadow-sm dark:bg-neutral-700 dark:text-white"
                                        : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400"
                                        }`}
                                >
                                    Dark
                                </button>
                                <button
                                    onClick={() => setTheme("system")}
                                    className={`rounded-md px-3 py-1.5 text-sm font-medium transition-all ${theme === "system"
                                        ? "bg-white text-black shadow-sm dark:bg-neutral-700 dark:text-white"
                                        : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400"
                                        }`}
                                >
                                    System
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="border-b border-neutral-100 px-6 py-4 dark:border-neutral-800">
                        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                            Notifications
                        </h2>
                    </div>
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800">
                                    <IconBell className="h-5 w-5 text-neutral-500" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-neutral-900 dark:text-white">
                                        Email Notifications
                                    </h3>
                                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                        Receive updates about your course generation
                                    </p>
                                </div>
                            </div>
                            <Switch
                                checked={emailNotifs}
                                onCheckedChange={setEmailNotifs}
                            />
                        </div>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="overflow-hidden rounded-xl border border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-900/10">
                    <div className="px-6 py-4">
                        <h2 className="text-lg font-semibold text-red-700 dark:text-red-400">
                            Danger Zone
                        </h2>
                    </div>
                    <div className="p-6 pt-0">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium text-neutral-900 dark:text-white">
                                    Delete Account
                                </h3>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                    Permanently delete your account and all data
                                </p>
                            </div>
                            <button className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700">
                                <IconTrash className="h-4 w-4" />
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
