import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getFinancialAdvice(data: any, feedback: string[] = []) {
  const feedbackContext = feedback.length > 0 
    ? `\n\nUser feedback on previous insights (please incorporate this to improve current recommendations): ${feedback.join("; ")}`
    : "";

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `You are a world-class financial advisor. Based on the following transaction data, provide 3-4 highly personalized, actionable insights for improving wealth management and spending efficiency. 
    
    Focus on:
    1. Identifying potential savings in recurring categories.
    2. Highlighting unusual spending patterns.
    3. Suggesting investment or budget adjustments.
    
    Format the response using clear headings and bullet points in Markdown. Keep it concise, encouraging, and professional.${feedbackContext}
    
    Data: ${JSON.stringify(data)}`,
  });
  
  return response.text || "Unable to generate advice at this time.";
}
