import express from 'express';
import { analyzeRepo } from '../services/githubService.js';
import { fetchIssues } from '../services/issueService.js';
import { generateRepoSummary } from '../services/geminiService.js';
import { explainIssue } from '../services/issueExplainerService.js';
import pool from "../db.js";

const router = express.Router();

router.post('/analyze', async (req, res) => {
    try {
        const { repoUrl } = req.body;

        if (!repoUrl) {
            return res.status(400).json({ error: 'repoUrl is required' });
        }

        const cachedResult = await pool.query(
            "SELECT * FROM reposummary WHERE repourl = $1",
            [repoUrl]
        );

        console.log('Cached result rows:', cachedResult.rows.length);

        if (cachedResult.rows.length > 0) {
            const row = cachedResult.rows[0];
            console.log('Found cached data, createdat:', row.createdat);

            const createdTime = new Date(row.createdat).getTime();
            const nowTime = Date.now();
            const cacheAge = (nowTime - createdTime) / (1000 * 60 * 60);

            console.log('cacheAge (hours):', cacheAge);

            if (cacheAge < 24) {
                console.log('✓ Returning cached result');
                return res.json(JSON.parse(row.summary));
            }
        }

        console.log('Cache expired or not found, fetching fresh...');

        const result = await analyzeRepo(repoUrl);
        const summary = await generateRepoSummary(result);

        await pool.query(
            "INSERT INTO reposummary(repourl, summary) VALUES ($1,$2) ON CONFLICT (repourl) DO UPDATE SET summary=$2, createdat=NOW()",
            [repoUrl, JSON.stringify(summary)]
        );
        console.log('Cache saved successfully');

        res.json(summary);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/issues", async (req,res)=> {
    try {
        const {repoUrl} = req.body;

        if(!repoUrl){
            return res.status(400).json({ error: 'repoUrl is required'});
        }

        const urlParts = repoUrl.replace('.git','').split('/');
        const owner = urlParts[3];
        const repo = urlParts[4];
        console.log('owner:', owner, 'repo:', repo);

        const {allIssues, beginnerIssues} = await fetchIssues(owner, repo);

        res.json({
            total: allIssues.length,
            beginnerCount: beginnerIssues.length,
            beginnerIssues,
            allIssues
        });
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

router.post("/explain-issue",async (req,res)=>{
    try {
        const {issue} = req.body;

        if(!issue){
            return res.status(400).json({error: 'issue object is required'});
        }

        const explaination = await explainIssue(issue);
        res.json(explaination);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});



export default router;