import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from "dotenv"

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateRepoSummary({ owner, repo, fileTree, readme }) {
    try {
        const fileList = fileTree.filter(item => item.type === 'blob').map(item => item.path).join('\n');

        const readmeText = readme.length > 3000 ? readme.substring(0, 3000) + '...' : readme;

        const prompt = `Analyze this GitHub repository and provide a structured summary.

Repository: ${owner}/${repo}

File Structure (first 100 files):
${fileList.split('\n').slice(0, 100).join('\n')}

README Content:
${readmeText}

Please provide a JSON response with these exact fields:
{
  "whatItDoes": "Brief description of what the repo does",
  "techStack": ["list", "of", "technologies"],
  "folderStructure": "Explanation of the main folder organization",
  "difficulty": "Easy/Medium/Hard - for a new contributor",
  "keyFeatures": ["feature 1", "feature 2"]
}

Return ONLY valid JSON, no extra text.`;

        const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        const cleaned = responseText.replace(/```json|```/g, '').trim();
        const summary = JSON.parse(cleaned);
        return summary;
    } catch (error) {
        console.error('Error generating summary:', error.message);
        throw error;
    }
};