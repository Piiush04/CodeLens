import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv"

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function explainIssue(issue) {
    try {
         const prompt = `Explain this GitHub issue in simple, beginner-friendly language for someone new to the codebase.

Issue Title: ${issue.title}
Issue Body: ${(issue.body || '').substring(0, 1000)}
Issue Number: #${issue.number}

Provide a JSON response:
{
  "simpleSummary": "1-2 sentence explanation of what needs to be done",
  "whyItMatters": "Why this issue is important to the project",
  "difficulty": "Beginner/Intermediate/Advanced",
  "estimatedTime": "Time estimate (e.g., 1-2 hours)"
}

Return ONLY valid JSON.`;

        const model = genAI.getGenerativeModel({model: 'gemini-3.6-flash'});
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        const cleaned = responseText.replace(/```json|```/g, '').trim();
        return JSON.parse(cleaned);
    } catch (error) {
        console.error('Error explaining issue: ',error.message);
        throw error;
    }
}