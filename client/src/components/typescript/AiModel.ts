import { GoogleGenerativeAI } from "@google/generative-ai"

const apiKey = "AIzaSyBFQHB-gk1fzczz1iRMypRQNwd-7FXpZLg"

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function apiCall(prompt:string) {
    console.log("the ai prompt is ", prompt)
    const result = await model.generateContent(prompt);
    // console.log("the response from api is ", result.response.text());
    return result.response.text()
}

