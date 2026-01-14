import { geminiModel } from "@/lib/langchain/models";
import {
    COURSE_GENERATION_SYSTEM_PROMPT,
    COURSE_GENERATION_USER_PROMPT,
} from "../prompts/course-prompt";
import { CourseSchema, type Course } from "../types/course.types";

import { initChatModel, HumanMessage, SystemMessage } from "langchain";
import prisma from "@/lib/db";

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
     * Generate and save course in one operation
     */
    async generateAndSaveCourse(topic: string, userId: string) {
        const course = await this.generateCourse(topic);
        const savedCourse = await this.saveCourse(course, userId);
        return savedCourse;
    }
}

// Export singleton instance
export const courseGenerator = new CourseGeneratorService();
