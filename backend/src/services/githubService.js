import axios from "axios"
import dotenv from "dotenv"

dotenv.config();

const GITHUB_PAT = process.env.GITHUB_PAT;
const githubAPI = axios.create({
    baseURL: 'https://api.github.com',
    headers:{
        Authorization: `token ${GITHUB_PAT}`,
    },
});

export async function analyzeRepo(repoUrl){
    try {
        const urlParts = repoUrl.replace('.git','').split("/");
        const owner = urlParts[3];
        const repo = urlParts[4];
        
        const response = await githubAPI.get(`/repos/${owner}/${repo}`);

        const branch = response.data.default_branch;

        const treeResponse = await githubAPI.get(`/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`);

        const fileTree = treeResponse.data.tree;
        
        const readmeResponse = await githubAPI.get(`/repos/${owner}/${repo}/readme`);
        const readme = Buffer.from(readmeResponse.data.content, 'base64').toString('utf-8');

        return {owner,repo,branch,fileTree,readme};

    } catch (error) {
        console.error("Error analyzing repo: ", error.message);
        throw error;
    }
}