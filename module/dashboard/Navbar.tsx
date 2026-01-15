"use client";
import React, { useState, useEffect } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
    IconArrowLeft,
    IconBrandTabler,
    IconSettings,
    IconUserBolt,
    IconSun,
    IconMoon,
} from "@tabler/icons-react";
import { useTheme } from "next-themes";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";

export function SidebarDemo({ children }: { children?: React.ReactNode }) {
    const [user, setUser] = useState<{ name: string; email: string; image?: string } | null>(null);

    const links = [
        {
            label: "Dashboard",
            href: "/",
            icon: (
                <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
        },
        {
            label: "Profile",
            href: "/profile",
            icon: (
                <IconUserBolt className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
        },
        {
            label: "Settings",
            href: "/settings",
            icon: (
                <IconSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
        },
    ];

    useEffect(() => {
        const fetchUser = async () => {
            const session = await authClient.getSession();
            if (session?.data?.user) {
                setUser({
                    name: session.data.user.name || "",
                    email: session.data.user.email,
                    image: session.data.user.image || undefined,
                });
            }
        };
        fetchUser();
    }, []);

    const handleLogout = async () => {
        const { authClient } = await import("@/lib/auth-client");
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    window.location.href = "/login";
                },
            },
        });
    };

    const [open, setOpen] = useState(false);
    return (
        <div className="flex h-screen w-full flex-col overflow-hidden bg-gray-50 md:flex-row dark:bg-neutral-900">
            <Sidebar open={open} setOpen={setOpen}>
                <SidebarBody className="justify-between gap-10">
                    <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
                        {open ? <Logo /> : <LogoIcon />}
                        <div className="mt-8 flex flex-col gap-2">
                            {links.map((link, idx) => (
                                <SidebarLink key={idx} link={link} />
                            ))}
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-neutral-700 transition-colors hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
                            >
                                <IconArrowLeft className="h-5 w-5 shrink-0" />
                                <span className={open ? "block" : "hidden"}>Logout</span>
                            </button>
                            <ThemeToggle open={open} />
                        </div>
                    </div>
                    <div>
                        <SidebarLink
                            link={{
                                label: user?.name || "User",
                                href: "/profile",
                                icon: user?.image ? (
                                    <img
                                        src={user.image}
                                        className="h-7 w-7 shrink-0 rounded-full"
                                        width={50}
                                        height={50}
                                        alt="Avatar"
                                    />
                                ) : (
                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-xs font-semibold dark:bg-neutral-700">
                                        {user?.name?.[0]?.toUpperCase() || "U"}
                                    </div>
                                ),
                            }}
                        />
                    </div>
                </SidebarBody>
            </Sidebar>
            <main className="flex-1 overflow-y-auto p-2 md:p-10">
                {children}
            </main>
        </div>
    );
}

export const Logo = () => {
    return (
        <a
            href="#"
            className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
        >
            <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-medium whitespace-pre text-black dark:text-white"
            >
                AI Course Gen
            </motion.span>
        </a>
    );
};
export const LogoIcon = () => {
    return (
        <a
            href="#"
            className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
        >
            <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
        </a>
    );
};

const ThemeToggle = ({ open }: { open: boolean }) => {
    const { setTheme, theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="h-9 w-9 rounded-md bg-neutral-100 dark:bg-neutral-800" />
        );
    }

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-neutral-700 transition-colors hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
        >
            {theme === "dark" ? (
                <IconSun className="h-5 w-5 shrink-0" />
            ) : (
                <IconMoon className="h-5 w-5 shrink-0" />
            )}
            <span className={open ? "block" : "hidden"}>
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </span>
        </button>
    );
};
