import {GoogleGenerativeAI} from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateStartHereGuide({issue, filePaths, owner, repo}) {
  try {
    const fileListString = filePaths.join('\n');

    const prompt = `Given this GitHub issue:
Title: ${issue.title}
Body: ${(issue.body || '').substring(0, 500)}

Files in ${owner}/${repo}:
${fileListString}

Which 5-7 files are most relevant to fixing this issue?
For each file, explain what it does and what changes are needed.

Return ONLY JSON:
{
  "files": [
    {"path": "...", "purpose": "...", "changes": "..."}
  ],
  "summary": "..."
}`;

    const model = genAI.getGenerativeModel({model: 'gemini-3.5-flash-lite'});
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    const cleaned = responseText.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);

  } catch (error) {
    console.error('Error generating guide:', error.message);
    throw error;
  }
}