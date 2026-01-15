import { UnifiedAuthForm } from "@/module/auth/components/unified-auth";

export default function LoginPage() {
    return (
        <div className="flex min-h-screen w-full">
            {/* Left Side - Hero/Testimonial */}
            <div className="hidden w-1/2 flex-col justify-between bg-black p-10 text-white lg:flex">
                <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-md bg-white"></div>
                    <span className="text-lg font-semibold">AI Course Gen</span>
                </div>

                <div className="max-w-md">
                    <h2 className="mb-6 text-3xl font-bold leading-tight">
                        "The fastest way to create educational content. This tool has completely transformed how I build courses."
                    </h2>
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-neutral-800"></div>
                        <div>
                            <p className="font-medium">Alex Chen</p>
                            <p className="text-sm text-neutral-400">Product Designer</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6 text-sm text-neutral-400">
                    <span>© 2024 AI Course Generator</span>
                    <a href="#" className="hover:text-white">Privacy</a>
                    <a href="#" className="hover:text-white">Terms</a>
                </div>
            </div>

            {/* Right Side - Auth Form */}
            <div className="flex w-full items-center justify-center bg-white p-8 dark:bg-black lg:w-1/2">
                <div className="w-full max-w-md">
                    <UnifiedAuthForm />
                </div>
            </div>
        </div>
    );
}
