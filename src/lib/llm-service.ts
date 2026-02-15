
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.GEMINI_API_KEY;

export class LlmService {
    private static genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;
    private static model = API_KEY ? LlmService.genAI?.getGenerativeModel({ model: 'gemini-pro' }) : null;

    static async generate(prompt: string, systemInstruction?: string): Promise<string> {
        if (!this.model) {
            console.warn('LLM Service: No API Key found, falling back to mock.');
            throw new Error('NO_API_KEY');
        }

        try {
            const finalPrompt = systemInstruction
                ? `${systemInstruction}\n\nUser: ${prompt}`
                : prompt;

            const result = await this.model.generateContent(finalPrompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error('LLM Service Error:', error);
            throw error;
        }
    }

    static async generateJSON<T>(prompt: string, schemaDescription: string): Promise<T> {
        if (!this.model) {
            throw new Error('NO_API_KEY');
        }

        const jsonPrompt = `
        ${prompt}
        
        You must output ONLY valid JSON.
        Schema: ${schemaDescription}
        Do not include markdown formatting like \`\`\`json.
        `;

        try {
            const text = await this.generate(jsonPrompt);
            const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(cleanText) as T;
        } catch (error) {
            console.error('LLM JSON Error:', error);
            throw error;
        }
    }
}
