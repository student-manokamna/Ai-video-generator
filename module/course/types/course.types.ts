import { z } from "zod";

// Zod schemas for runtime validation
export const ChapterSchema = z.object({
    chapterId: z.string(),
    chapterTitle: z.string(),
    subContent: z.array(z.string()).max(3),
});

export const CourseSchema = z.object({
    courseId: z.string(),
    courseName: z.string(),
    courseDescription: z.string(),
    level: z.enum(["Beginner", "Intermediate", "Advanced"]),
    totalChapters: z.number(),
    chapters: z.array(ChapterSchema).max(3),
});

// TypeScript types
export type Chapter = z.infer<typeof ChapterSchema>;
export type Course = z.infer<typeof CourseSchema>;

// API Request/Response types
export interface GenerateCourseRequest {
    topic: string;
    userId?: string;
}

export interface GenerateCourseResponse {
    success: boolean;
    course?: Course;
    error?: string;
}
