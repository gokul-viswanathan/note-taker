import { GoogleGenerativeAI } from "@google/generative-ai"

const apiKey = "AIzaSyBFQHB-gk1fzczz1iRMypRQNwd-7FXpZLg"

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function apiCall(prompt:string) {
    const result = await model.generateContent(prompt);
    return result.response.text()
}

