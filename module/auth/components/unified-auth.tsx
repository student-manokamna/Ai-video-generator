"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function UnifiedAuthForm() {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        try {
            if (isLogin) {
                // Login flow
                const { data, error } = await authClient.signIn.email({
                    email,
                    password,
                    fetchOptions: {
                        onSuccess: () => {
                            router.push("/");
                        },
                        onError: () => {
                            alert("Login failed");
                        },
                    },
                });

               
            } else {
                // Signup flow
                const name = formData.get("name") as string;
                const { data, error } = await authClient.signUp.email({
                    email,
                    password,
                    name,
                    fetchOptions: {
                        onSuccess: () => {
                            router.push("/");
                        },
                        onError: () => {
                            alert("Signup failed");
                        },
                    },
                });

                
            }
        } catch (err) {
            console.error(err);
            alert("An error occurred");
            setLoading(false);
        }
    };

    const handleSocialAuth = async (provider: "github" | "google") => {
        try {
            await authClient.signIn.social({
                provider,
                callbackURL: "/",
            });
        } catch (err) {
            console.error(err);
            alert(`${provider} login failed`);
        }
    };

    return (
        <div className="shadow-input mx-auto w-full max-w-md rounded-2xl bg-white p-8 dark:bg-black">
            {/* Tab Switcher */}
            <div className="mb-6 flex gap-2 rounded-lg bg-gray-100 p-1 dark:bg-zinc-900">
                <button
                    type="button"
                    onClick={() => setIsLogin(true)}
                    className={cn(
                        "flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all",
                        isLogin
                            ? "bg-white text-black shadow-sm dark:bg-zinc-800 dark:text-white"
                            : "text-gray-600 dark:text-gray-400"
                    )}
                >
                    Login
                </button>
                <button
                    type="button"
                    onClick={() => setIsLogin(false)}
                    className={cn(
                        "flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all",
                        !isLogin
                            ? "bg-white text-black shadow-sm dark:bg-zinc-800 dark:text-white"
                            : "text-gray-600 dark:text-gray-400"
                    )}
                >
                    Sign Up
                </button>
            </div>

            <h2 className="mb-2 text-2xl font-bold text-neutral-800 dark:text-neutral-200">
                {isLogin ? "Welcome back" : "Create account"}
            </h2>
            <p className="mb-6 text-sm text-neutral-600 dark:text-neutral-300">
                {isLogin
                    ? "Enter your credentials to continue"
                    : "Sign up to get started"}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                    <LabelInputContainer>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="John Doe"
                            type="text"
                            required
                        />
                    </LabelInputContainer>
                )}

                <LabelInputContainer>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                        id="email"
                        name="email"
                        placeholder="you@example.com"
                        type="email"
                        required
                    />
                </LabelInputContainer>

                <LabelInputContainer>
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        name="password"
                        placeholder="••••••••"
                        type="password"
                        minLength={8}
                        required
                    />
                    {!isLogin && (
                        <p className="mt-1 text-xs text-gray-500">
                            Minimum 8 characters
                        </p>
                    )}
                </LabelInputContainer>

                <button
                    className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] disabled:opacity-50 dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Please wait..." : isLogin ? "Login" : "Sign up"} &rarr;
                    <BottomGradient />
                </button>

                <div className="my-6 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

                <div className="flex flex-col space-y-3">
                    <button
                        type="button"
                        onClick={() => handleSocialAuth("github")}
                        className="group/btn shadow-input relative flex h-10 w-full items-center justify-center space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:text-white dark:shadow-[0px_0px_1px_1px_#262626]"
                    >
                        <IconBrandGithub className="h-4 w-4" />
                        <span className="text-sm">Continue with GitHub</span>
                        <BottomGradient />
                    </button>

                    <button
                        type="button"
                        onClick={() => handleSocialAuth("google")}
                        className="group/btn shadow-input relative flex h-10 w-full items-center justify-center space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:text-white dark:shadow-[0px_0px_1px_1px_#262626]"
                    >
                        <IconBrandGoogle className="h-4 w-4" />
                        <span className="text-sm">Continue with Google</span>
                        <BottomGradient />
                    </button>
                </div>
            </form>
        </div>
    );
}

const BottomGradient = () => {
    return (
        <>
            <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
            <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
        </>
    );
};

const LabelInputContainer = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <div className={cn("flex w-full flex-col space-y-2", className)}>
            {children}
        </div>
    );
};
