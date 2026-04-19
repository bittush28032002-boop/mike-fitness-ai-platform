import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const SYSTEM_INSTRUCTION = "You are an elite fitness and nutrition coach at Mike Johnson Fitness in Los Angeles. Be professional, motivating, and concise. Your advice should be science-based and premium in tone. Focus on performance, aesthetics, and longevity.";

export function createChatSession() {
  return ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction: SYSTEM_INSTRUCTION
    }
  });
}

export async function getFitnessAdvice(prompt: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "You are an elite fitness and nutrition coach at Mike Johnson Fitness in Los Angeles. Be professional, motivating, and concise. Your advice should be science-based and premium in tone."
      }
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API error:", error);
    return "I'm having trouble connecting to my AI trainer brain at the moment. Please try again later.";
  }
}

export async function generateMealPlan(goal: string, dietPref: string, calories: number) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a one-day meal plan for the following: Goal: ${goal}, Dietary Preference: ${dietPref}, Daily Calories: ${calories}. Format it as JSON with fields for breakfast, lunch, dinner, and snacks.`,
      config: {
        responseMimeType: "application/json",
        systemInstruction: "You are a professional sports nutritionist. Provide precise measurements and macros."
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini API error (meal plan):", error);
    return null;
  }
}
