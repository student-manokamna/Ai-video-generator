import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

// Initialize Gemini model with configuration
export const geminiModel = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    apiKey: process.env.GOOGLE_API_KEY,
    temperature: 0.7,
    maxOutputTokens: 8192,
});

// For JSON mode responses

