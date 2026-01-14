import { geminiModel } from "@/lib/langchain/models";
import { SystemMessage, HumanMessage } from "langchain";
import {
    GENERATE_VIDEO_PROMPT,
    GENERATE_SLIDE_USER_PROMPT,
} from "../prompts/slide-prompt";
import { z } from "zod";

// Zod schema for slide validation
const SlideSchema = z.object({
    slideId: z.string(),
    slideIndex: z.number(),
    title: z.string(),
    subtitle: z.string().optional(),
    audioFileName: z.string(),
    narration: z.object({
        fullText: z.string(),
    }),
});

const SlidesArraySchema = z.array(SlideSchema);

export interface SlideData {
    slideId: string;
    slideIndex: number;
    title: string;
    subtitle?: string;
    audioFileName: string;
    narration: {
        fullText: string;
    };
}

export class SlideGeneratorService {
    /**
     * Generate slides for a chapter using LangChain and Gemini
     */
    async generateSlides(
        courseName: string,
        chapterTitle: string,
        subContent: string[]
    ): Promise<SlideData[]> {
        try {
            // Use structured output to force valid JSON array
            const structuredModel = geminiModel.withStructuredOutput(SlidesArraySchema);

            const messages = [
                new SystemMessage(GENERATE_VIDEO_PROMPT),
                new HumanMessage(
                    GENERATE_SLIDE_USER_PROMPT(courseName, chapterTitle, subContent)
                ),
            ];

            // Invoke the model - it will automatically return validated array
            const slides = await structuredModel.invoke(messages);
            console.log(slides, "slides acche se dekh bhai", slides.length, "slides")
            return slides;
        } catch (error) {
            console.error("Error generating slides:", error);
            throw new Error("Failed to generate slides");
        }
    }
}

// Export singleton instance
export const slideGenerator = new SlideGeneratorService();
