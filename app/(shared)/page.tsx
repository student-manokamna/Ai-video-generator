import { requiredAuth } from "@/module/auth/utils/auth-utils";
import ChatBot from "@/module/dashboard/ChatBot";
import UserCourses from "@/module/dashboard/UserCourses";

export default async function Home() {
    await requiredAuth()
    return (
        <div className="flex flex-col items-center w-full">
            <ChatBot />
            <UserCourses />
        </div>
    );
}
