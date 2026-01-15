
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const user = session.user;
        console.log(`Seeding courses for user: ${user.name} (${user.id})`);

        const coursesToCreate = [
            "Introduction to AI",
            "Python Mastery",
            "Web Dev Bootcamp",
            "Data Science Basics",
            "Machine Learning 101"
        ];

        for (const title of coursesToCreate) {
            const courseId = title.toLowerCase().replace(/ /g, '-') + '-' + Math.random().toString(36).substring(7);
            await prisma.course.create({
                data: {
                    courseId: courseId,
                    courseName: title,
                    courseDescription: "Recovered legacy course content.",
                    level: "Beginner",
                    totalChapters: 2,
                    userId: user.id,
                    chapters: {
                        create: [
                            {
                                chapterId: "legacy-chapter-1-" + Math.random(),
                                chapterTitle: "Introduction",
                                subContent: ["Topic 1", "Topic 2"]
                            },
                            {
                                chapterId: "legacy-chapter-2-" + Math.random(),
                                chapterTitle: "Deep Dive",
                                subContent: ["Topic 3", "Topic 4"]
                            }
                        ]
                    }
                }
            });
        }

        return NextResponse.json({ success: true, message: "Seeded 5 courses" });
    } catch (error) {
        console.error("[SEED_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
