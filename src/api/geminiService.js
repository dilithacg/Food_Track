import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyDqUZlzQpuP2ixWUzbdDYEoIaM2YRZu03A";
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

  // --- 2. IMAGE ANALYSIS LOGIC (Merged) ---
  async analyzeFoodImage(imageFile) {
    try {
      // 1.5-flash is optimized for multimodal (image + text) tasks
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      // Convert image file to base64 for the API
      const base64Image = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(imageFile);
      });
      const prompt = `Identify the food and provide ONLY these details in this exact format:
- Calories: [number only]
- Rating: [Good/Medium/Bad]
- Ingredients: [list main ingredients]
- Tip: [one short waste-prevention tip]`;

      const result = await model.generateContent([
        {
          inlineData: {
            data: base64Image,
            mimeType: imageFile.type,
          },
        },
        prompt,
      ]);

      return result.response.text();
    } catch (error) {
      console.error("Image Analysis Error:", error);
      throw error;
    }
  },
};
