import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyCt6PqsRU1oKh57GYTiTw7SXLKIfJ-ziT8";
const genAI = new GoogleGenerativeAI(API_KEY);

export const ChatService = {
  async getChefResponse(userMessage) {
    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        systemInstruction: `You are "Chef Track," a professional kitchen assistant. 
          1. Answer ONLY cooking, food, or ingredient related questions.
          2. Use Sri Lankan context (e.g., coconut milk, spices) when appropriate.
          3. Keep answers brief, helpful, and encouraging.
          4. If asked about non-food topics, say: "I only know my way around the kitchen! Ask me about recipes or ingredients."`,
      });

      const result = await model.generateContent(userMessage);
      return result.response.text();
    } catch (error) {
      console.error("Gemini Error:", error);
      throw error; // Let the UI handle the error state
    }
  },
};
