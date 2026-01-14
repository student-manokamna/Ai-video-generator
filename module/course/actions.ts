"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

// This is a "Server Action"
// It runs entirely on the server, like an API route, but you call it like a function.
export async function updateChapterTitle(chapterId: string, newTitle: string) {
    try {
        // 1. Direct Database Access (No need for fetch)
        await prisma.chapter.update({
            where: { id: chapterId },
            data: { chapterTitle: newTitle }
        });

        // 2. Refresh the UI automatically
        revalidatePath(`/course`);

        return { success: true };
    } catch (error) {
        console.error("Failed to update title:", error);
        return { success: false, error: "Failed to update" };
    }
}
