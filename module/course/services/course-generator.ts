import { geminiModel } from "@/lib/langchain/models";
import {
    COURSE_GENERATION_SYSTEM_PROMPT,
    COURSE_GENERATION_USER_PROMPT,
} from "../prompts/course-prompt";
import { CourseSchema, type Course } from "../types/course.types";

import { initChatModel, HumanMessage, SystemMessage } from "langchain";
import prisma from "@/lib/db";
import { slideGenerator } from "./slide-generator";
import { audioGenerator } from "./audio-generator";

export class CourseGeneratorService {
    /**
     * Generate course content using LangChain and Gemini
     */
    async generateCourse(topic: string): Promise<Course> {
        try {
            // Use structured output to force valid JSON
            const structuredModel = geminiModel.withStructuredOutput(CourseSchema);

            // Create messages for LangChain
            const messages = [
                new SystemMessage(COURSE_GENERATION_SYSTEM_PROMPT),
                new HumanMessage(COURSE_GENERATION_USER_PROMPT(topic)),
            ];

            // Invoke the model - it will automatically return validated Course object
            const validatedCourse = await structuredModel.invoke(messages);
            console.log(validatedCourse, "validatedCourse acche se dekh bhai")
            return validatedCourse;
        } catch (error) {
            console.error("Error generating course:", error);
            throw new Error("Failed to generate course content");
        }
    }

    /**
     * Save course to database
     */
    async saveCourse(course: Course, userId: string) {
        try {
            console.log(course, "entry savecourse me")
            const savedCourse = await prisma.course.create({
                data: {
                    courseId: course.courseId,
                    courseName: course.courseName,
                    courseDescription: course.courseDescription,
                    level: course.level,
                    totalChapters: course.totalChapters,
                    userId,
                    chapters: {
                        create: course.chapters.map((chapter) => ({
                            chapterId: chapter.chapterId,
                            chapterTitle: chapter.chapterTitle,
                            subContent: chapter.subContent,
                            notes: chapter.notes,
                        })),
                    },
                },
                include: {
                    chapters: true,
                },
            });
            console.log(savedCourse, "savedCourse acche se dekh bhai")
            return savedCourse;
        } catch (error) {
            console.error("Error saving course:", error);
            throw new Error("Failed to save course to database");
        }
    }

    /**
     * Generate content (slides & audio) for a specific chapter
     */
    async generateChapterContent(chapterId: string, courseName: string, chapterTitle: string, subContent: string[]) {
        try {
            // 1. Generate Slides
            const slides = await slideGenerator.generateSlides(courseName, chapterTitle, subContent);

            // 2. Generate Audio for Slides
            const audioMap = await audioGenerator.generateAudioBatch(
                slides.map(s => ({
                    slideId: s.slideId,
                    narration: s.narration.fullText
                }))
            );

            // 3. Save Slides to DB
            // We use a transaction or just sequential updates
            // Since we need to likely map the slideId back to db, but here we can just create them
            // The slideId from AI is distinct from DB ID.

            for (const slide of slides) {
                const audioPath = audioMap.get(slide.slideId);

                await prisma.slide.create({
                    data: {
                        slideId: slide.slideId,
                        slideIndex: slide.slideIndex,
                        title: slide.title,
                        subtitle: slide.subtitle,
                        narration: slide.narration.fullText,
                        audioFileName: audioPath, // Can be null if failed
                        chapterId: chapterId,
                    }
                });
            }

            console.log(`Generated content for chapter ${chapterTitle}`);

        } catch (error) {
            console.error(`Failed to generate content for chapter ${chapterId}:`, error);
            // Don't throw, just log so other chapters might succeed? 
            // Or throw to allow retry?
        }
    }

    /**
     * Generate and save course in one operation
     */
    async generateAndSaveCourse(topic: string, userId: string) {
        // 1. Generate Structure
        const course = await this.generateCourse(topic);

        // 2. Save Structure
        const savedCourse = await this.saveCourse(course, userId);

        // 3. Trigger Content Generation (Async background-ish)
        // In Vercel, this might timeout if we await it fully. 
        // For 'dev', we can await. For prod, ideally use Inngest/Queue.
        // We will loop through chapters and generate content.

        console.log("Starting content generation for chapters...");

        // We'll process in parallel to speed it up!
        await Promise.all(
            savedCourse.chapters.map((chapter) =>
                this.generateChapterContent(
                    chapter.id, // DB ID
                    savedCourse.courseName,
                    chapter.chapterTitle,
                    chapter.subContent
                )
            )
        );

        return savedCourse;
    }
}

// Export singleton instance
export const courseGenerator = new CourseGeneratorService();
