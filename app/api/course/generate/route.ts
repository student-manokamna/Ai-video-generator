import { NextRequest, NextResponse } from "next/server";
import { courseGenerator } from "@/module/course/services/course-generator";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(req: NextRequest) {
    try {
        // Get authenticated user
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Parse request body
        const body = await req.json();
        const { topic } = body;

        if (!topic || typeof topic !== "string") {
            return NextResponse.json(
                { success: false, error: "Topic is required" },
                { status: 400 }
            );
        }

        // Generate and save course
        const course = await courseGenerator.generateAndSaveCourse(
            topic,
            session.user.id
        );

        return NextResponse.json({
            success: true,
            course,
        });
    } catch (error) {
        console.error("Course generation error:", error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : "Internal server error",
            },
            { status: 500 }
        );
    }
}
