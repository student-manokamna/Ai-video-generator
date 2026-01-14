import { NextRequest, NextResponse } from "next/server";
import { slideGenerator } from "@/module/course/services/slide-generator";
import { audioGenerator } from "@/module/course/services/audio-generator";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
    try {
        // Await params in Next.js 15
        const { courseId, chapterId } = await params;

        // Check authentication
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get chapter with course info
        const chapter = await prisma.chapter.findFirst({
            where: {
                chapterId: chapterId,
                course: {
                    courseId: courseId
                }
            },
            include: { course: true },
        });

        if (!chapter) {
            return NextResponse.json(
                { error: "Chapter not found" },
                { status: 404 }
            );
        }

        // Check if slides already exist
        const existingSlides = await prisma.slide.findMany({
            where: { chapterId: chapter.id },
        });

        if (existingSlides.length > 0) {
            return NextResponse.json({
                success: true,
                slides: existingSlides,
                message: "Slides already generated",
            });
        }

        // Generate slides using LangChain
        const generatedSlides = await slideGenerator.generateSlides(
            chapter.course.courseName,
            chapter.chapterTitle,
            chapter.subContent
        );

        // Generate audio for all slides
        const audioMap = await audioGenerator.generateAudioBatch(
            generatedSlides.map((slide) => ({
                slideId: slide.slideId,
                narration: slide.narration.fullText,
            }))
        );

        // Save slides to database
        const savedSlides = await Promise.all(
            generatedSlides.map(async (slide) => {
                return prisma.slide.create({
                    data: {
                        slideIndex: slide.slideIndex,
                        slideId: slide.slideId,
                        title: slide.title,
                        subtitle: slide.subtitle || null,
                        audioFileName: audioMap.get(slide.slideId) || null,
                        narration: slide.narration.fullText,
                        chapterId: chapter.id,
                    },
                });
            })
        );

        return NextResponse.json({
            success: true,
            slides: savedSlides,
            message: `Generated ${savedSlides.length} slides`,
        });
    } catch (error) {
        console.error("Video generation error:", error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : "Internal server error",
            },
            { status: 500 }
        );
    }
}
