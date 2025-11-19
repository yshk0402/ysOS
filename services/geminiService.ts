import { GoogleGenAI } from "@google/genai";

// Initialize the client using the environment variable
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const sendMessageToGemini = async (
  message: string, 
  history: { role: 'user' | 'model', parts: { text: string }[] }[]
): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    
    const chat = ai.chats.create({
        model: model,
        history: history, 
        config: {
            systemInstruction: "You are a helpful assistant running inside a Windows 95 simulation. Keep your answers concise, friendly, and perhaps a bit retro-tech themed if appropriate. You appreciate the aesthetic of 1995."
        }
    });

    const result = await chat.sendMessage({ message });
    return result.text || "Error: No text returned from model.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "A fatal exception 0E has occurred at 0028:C0011E36 in VXD VMM(01) + 00010E36. The current application will be terminated. (Just kidding, but there was an API error).";
  }
};
