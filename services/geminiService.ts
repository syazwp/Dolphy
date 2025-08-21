import { GoogleGenAI } from "@google/genai";
import type { Message } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you'd want to handle this more gracefully,
  // but for this example, we'll throw an error.
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const getChatResponse = async (knowledgeBase: string, userMessage: string): Promise<string> => {
  const model = 'gemini-2.5-flash';
  
  const systemInstruction = `You are a helpful and friendly chatbot for kids. Your name is Doplhy.
Your task is to answer questions based ONLY on the provided "Knowledge Base".
Do not use any external knowledge or your own information.
If the answer to a question cannot be found in the "Knowledge Base", you MUST respond with "I don't know the answer to that from the story you gave me. Try asking something else!".
Keep your answers simple, short, and friendly for a child.

Here is the Knowledge Base:
---
${knowledgeBase}
---
`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: userMessage,
      config: {
        systemInstruction: systemInstruction,
        // Disable thinking for faster, more direct responses appropriate for this use case.
        thinkingConfig: { thinkingBudget: 0 } 
      },
    });

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Oops! Something went wrong while I was thinking. Please try again.";
  }
};