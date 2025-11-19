import { GoogleGenAI } from "@google/genai";

// Initialize the client using the environment variable
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const sendMessageToGemini = async (
  message: string,
  history: { role: 'user' | 'model', parts: { text: string }[] }[]
): Promise<string> => {
  try {
    // Trying the experimental thinking model to bypass standard quota limits
    const model = 'gemini-2.0-flash-thinking-exp-01-21';

    console.log("Initializing Gemini chat with model:", model);
    console.log("API Key present:", !!process.env.API_KEY);

    const chat = ai.chats.create({
      model: model,
      history: history,
      config: {
        systemInstruction: "You are a helpful assistant running inside a Windows 95 simulation. Keep your answers concise, friendly, and perhaps a bit retro-tech themed if appropriate. You appreciate the aesthetic of 1995."
      }
    });

    const result = await chat.sendMessage({ message });
    return result.text || "Error: No text returned from model.";
  } catch (error: any) {
    console.error("Gemini API Error Details:", error);

    // Check for 429 Resource Exhausted
    if (error.status === 429 || (error.message && error.message.includes('429'))) {
      return "Error: API Quota Exceeded (429). Please wait a moment and try again, or check your Google Cloud billing/quota settings.";
    }

    return `Error: ${error instanceof Error ? error.message : String(error)}`;
  }
};
