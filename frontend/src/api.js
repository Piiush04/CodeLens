const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/repo';

export async function analyzeRepo(repoUrl){
    const response = await fetch(`${API_BASE}/analyze`,{
        method:'POST',
        headers:{'Content-Type': 'application/json'},
        body: JSON.stringify({repoUrl})
    });
    return response.json();
}

export async function fetchIssues(repoUrl) {
    const response = await fetch(`${API_BASE}/issues`,{
        method: 'POST',
        headers:{'Content-Type': 'application/json'},
        body: JSON.stringify({repoUrl})
    });
    return response.json();
}

export async function explainIssue(issue) {
    const response = await fetch(`${API_BASE}/explain-issue`,{
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({issue})
    });
    return response.json();   
}

export async function getStartHereGuide(issue, owner, repo) {
  const response = await fetch(`${API_BASE}/start-here-guide`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ issue, owner, repo })
  });
  return response.json();
}