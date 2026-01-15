import axios from "axios";
import fs from "fs";
import path from "path";

export class AudioGeneratorService {
    private apiKey: string;
    private apiUrl = "https://api.fonada.ai/tts/generate-audio";

    constructor() {
        this.apiKey = process.env.FONADA_API_KEY || "";
        if (!this.apiKey) {
            console.warn("FONADA_API_KEY not set in environment variables");
        }
    }

    /**
     * Generate audio file using FonadaLabs TTS API
     */
    async generateAudio(text: string, slideId: string): Promise<string> {
        try {
            console.log(`Generating audio for slide ${slideId} (Length: ${text.length} chars)`);
            console.log(`Using API Key: ${this.apiKey.substring(0, 5)}...`);

            const response = await axios.post(
                this.apiUrl,
                {
                    api_key: this.apiKey,
                    input: text,
                    voice: "Vaanee",
                    language: "English",
                },
                {
                    responseType: "arraybuffer",
                    timeout: 30000, // 30 second timeout
                }
            );

            console.log(`API Response Status: ${response.status}`);
            console.log(`Audio Data Size: ${response.data.length} bytes`);

            // Create audio directory if it doesn't exist
            const audioDir = path.join(process.cwd(), "public", "audio");
            if (!fs.existsSync(audioDir)) {
                fs.mkdirSync(audioDir, { recursive: true });
            }

            // Save audio file
            const fileName = `${slideId}.mp3`;
            const filePath = path.join(audioDir, fileName);

            fs.writeFileSync(filePath, response.data);

            // Return public URL path
            return `/audio/${fileName}`;
        } catch (error) {
            console.error("Error generating audio:", error);
            throw new Error("Failed to generate audio");
        }
    }

    /**
   * Generate audio for multiple slides sequentially with rate limiting
   */
    async generateAudioBatch(
        slides: Array<{ slideId: string; narration: string }>
    ): Promise<Map<string, string>> {
        const audioMap = new Map<string, string>();

        for (const slide of slides) {
            try {
                // Add artificial delay to prevent rate limiting (0.1 second)
                await new Promise(resolve => setTimeout(resolve, 100));

                const audioPath = await this.generateAudio(
                    slide.narration,
                    slide.slideId
                );
                audioMap.set(slide.slideId, audioPath);
            } catch (error) {
                console.error(`Failed to generate audio for ${slide.slideId}:`, error);
                // Continue with other slides even if one fails
            }
        }

        return audioMap;
    }
}

// Export singleton instance
export const audioGenerator = new AudioGeneratorService();
