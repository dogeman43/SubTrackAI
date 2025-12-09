import { GoogleGenAI, Type } from "@google/genai";
import { Subscription, AIAnalysisResponse } from "../types";

const apiKey = process.env.API_KEY || '';

// Initialize the client strictly according to guidelines
const ai = new GoogleGenAI({ apiKey });

export const analyzeSubscriptions = async (subscriptions: Subscription[]): Promise<AIAnalysisResponse> => {
  if (!apiKey) {
    console.warn("No API key found. Returning mock data.");
    return {
      insights: [
        {
          title: "API Key Missing",
          description: "Please configure your Gemini API key to receive smart insights.",
          type: "warning"
        }
      ]
    };
  }

  const prompt = `
    Analyze the following list of monthly subscriptions and provide financial insights.
    Subscriptions: ${JSON.stringify(subscriptions)}
    
    Return exactly 3 insights. 
    1. A potential saving tip.
    2. A spending pattern observation.
    3. An overall budget health comment.
    
    Keep descriptions concise (under 20 words).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            insights: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  type: { type: Type.STRING, enum: ["saving", "warning", "positive"] }
                },
                required: ["title", "description", "type"]
              }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }
    
    return JSON.parse(text) as AIAnalysisResponse;

  } catch (error) {
    console.error("Error analyzing subscriptions:", error);
    return {
      insights: [
        {
          title: "Analysis Failed",
          description: "Could not generate insights at this time.",
          type: "warning"
        }
      ]
    };
  }
};