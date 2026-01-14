import { UnifiedAuthForm } from "@/module/auth/components/unified-auth";

const LoginPage = async () => {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-black">
            <UnifiedAuthForm />
        </div>
    );
};

export default LoginPage;