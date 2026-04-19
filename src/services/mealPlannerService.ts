import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export interface GeneratedMeal {
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  description: string;
  calories: number;
}

export interface MealPlanResponse {
  meals: GeneratedMeal[];
  totalCalories: number;
  dietaryNote?: string;
}

export const generateMealPlan = async (
  goal: string,
  preferences: string,
  targetCalories: number
): Promise<MealPlanResponse> => {
  const prompt = `Generate a daily meal plan for a fitness enthusiast with the following profile:
    - Goal: ${goal}
    - Dietary Preferences: ${preferences}
    - Daily Target Calories: ${targetCalories} kcal
    
    The meal plan should include breakfast, lunch, dinner, and 1-2 snacks.
    Return the plan in structural JSON format.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          meals: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING, description: "Meal time: breakfast, lunch, dinner, or snack" },
                description: { type: Type.STRING, description: "Detailed description of the meal" },
                calories: { type: Type.NUMBER, description: "Estimated calories" }
              },
              required: ["type", "description", "calories"]
            }
          },
          totalCalories: { type: Type.NUMBER },
          dietaryNote: { type: Type.STRING }
        },
        required: ["meals", "totalCalories"]
      }
    }
  });

  const text = response.text.trim();
  return JSON.parse(text);
};
