import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyB0BzQOLMicY1AOGGC0ZwwxVB9bywhNnXQ";

const genAI = new GoogleGenerativeAI(API_KEY);

export const ChatService = {
  // =========================
  // CHEF CHAT
  // =========================
  async getChefResponse(userMessage) {
    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        systemInstruction: `
You are "Chef Track," a professional kitchen assistant.

1. Answer ONLY cooking, food, or ingredient related questions.
2. Use Sri Lankan cooking ideas when suitable.
3. Keep answers friendly and simple.
4. If asked unrelated topics say:
"I only know my way around the kitchen! Ask me about recipes or ingredients."
`,
      });

      const result = await model.generateContent(userMessage);

      return result.response.text();
    } catch (error) {
      console.error("Gemini Error:", error);
      throw error;
    }
  },

  // =========================
  // SMART RECIPE GENERATOR
  // =========================
  async generateRecipe(ingredients) {
    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        systemInstruction: `
You are a professional AI Chef.

Generate beautiful recipes using user ingredients.

Rules:
1. Create beginner-friendly recipes
2. Add recipe title
3. Add cooking time
4. Add ingredients
5. Add step-by-step instructions
6. Add short cooking tips
7. Use Sri Lankan flavors when suitable
8. Keep formatting clean
`,
      });

      const prompt = `
Create a recipe using these ingredients:

${ingredients.join(", ")}
`;

      const result = await model.generateContent(prompt);

      return result.response.text();
    } catch (error) {
      console.error("Recipe Error:", error);
      throw error;
    }
  },

  // =========================
  // FOOD IMAGE ANALYSIS
  // =========================
  async analyzeFoodImage(imageFile) {
    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
      });

      const base64Image = await new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => resolve(reader.result.split(",")[1]);

        reader.onerror = (error) => reject(error);

        reader.readAsDataURL(imageFile);
      });

      const prompt = `
Identify the food and provide ONLY these details in this exact format:

- Calories: [number only]
- Rating: [Good/Medium/Bad]
- Ingredients: [list main ingredients]
- Tip: [one short waste-prevention tip]
`;

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
