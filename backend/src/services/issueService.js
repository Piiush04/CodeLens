import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config();

const GITHUB_PAT = process.env.GITHUB_PAT;
const githubAPI = axios.create({
    baseURL: 'https://api.github.com',
    headers: {
        Authorization: `token ${GITHUB_PAT}`
    },
});

export async function fetchIssues(owner, repo) {
    try {

        const response = await githubAPI.get(`/repos/${owner}/${repo}/issues?state=open&per_page=50`);
        console.log('Response type:', typeof response.data);
        console.log('Is array:', Array.isArray(response.data));
        console.log('Sample:', JSON.stringify(response.data).substring(0, 200));
        const allIssues = response.data;

        const beginnerLabels = ['good first issue', 'beginner', 'easy', 'help wanted'];

        const beginnerIssues = allIssues.filter(issue => issue.labels.some(label => beginnerLabels.includes(label.name.toLowerCase())));

        return { allIssues, beginnerIssues };
    } catch (error) {
        console.error("Error fetching issues: ", error.message);
        throw error;
    }
}