import { useState } from 'react';
import { analyzeRepo, fetchIssues, explainIssue, getStartHereGuide } from './api';
import './App.css';

function App() {
  const [repoUrl, setRepoUrl] = useState('');
  const [summary, setSummary] = useState(null);
  const [issues, setIssues] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [explanation, setExplanation] = useState(null);
  const [guide, setGuide] = useState(null);
  const [guideLoading, setGuideLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!repoUrl.trim()) {
      alert('Please enter a repository URL');
      return;
    }

    setLoading(true);
    try {
      const [summaryData, issuesData] = await Promise.all([
        analyzeRepo(repoUrl),
        fetchIssues(repoUrl)
      ]);
      setSummary(summaryData);
      setIssues(issuesData);
      setSelectedIssue(null);
      setExplanation(null);
      setGuide(null);
    } catch (error) {
      alert('Error: ' + error.message);
    }
    setLoading(false);
  };

  const handleExplainIssue = async (issue) => {
    try {
      const exp = await explainIssue(issue);
      setSelectedIssue(issue);
      setExplanation(exp);
      setGuide(null);
    } catch (error) {
      alert('Error explaining issue: ' + error.message);
    }
  };

  const handleGetStartHereGuide = async (issue) => {
    try {
      setGuideLoading(true);
      const urlParts = repoUrl.replace('.git', '').split('/');
      const owner = urlParts[3];
      const repo = urlParts[4];
      
      const guideData = await getStartHereGuide(issue, owner, repo);
      setGuide(guideData);
    } catch (error) {
      alert('Error getting guide: ' + error.message);
    } finally {
      setGuideLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAnalyze();
    }
  };

  return (
    <div className="container">
      <header>
        <h1>🔍 CodeLens</h1>
        <p>Understand any GitHub repository. Find where to contribute.</p>
      </header>

      <main>
        <div className="input-section">
          <input
            type="text"
            placeholder="Paste GitHub repository URL (e.g., https://github.com/facebook/react)"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button onClick={handleAnalyze} disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span>
                Analyzing...
              </>
            ) : (
              'Analyze'
            )}
          </button>
        </div>

        {summary && (
          <div className="summary-section">
            <h2>Repository Summary</h2>
            <p>
              <strong>What it does:</strong> {summary.whatItDoes}
            </p>
            <p>
              <strong>Tech Stack:</strong> {summary.techStack.join(', ')}
            </p>
            <p>
              <strong>Difficulty Level:</strong> <span style={{ color: summary.difficulty === 'Hard' ? '#dc3545' : summary.difficulty === 'Medium' ? '#ffc107' : '#28a745' }}>{summary.difficulty}</span>
            </p>
            {summary.keyFeatures && (
              <p>
                <strong>Key Features:</strong>
                <ul>
                  {summary.keyFeatures.map((feature, i) => (
                    <li key={i} style={{ marginLeft: '20px', marginTop: '8px', borderLeft: 'none' }}>• {feature}</li>
                  ))}
                </ul>
              </p>
            )}
          </div>
        )}

        {issues && (
          <div className="issues-section">
            <h2>Beginner-Friendly Issues ({issues.beginnerCount})</h2>
            {issues.beginnerIssues.length > 0 ? (
              <ul>
                {issues.beginnerIssues.slice(0, 10).map(issue => (
                  <li key={issue.id}>
                    <div className="issue-title" onClick={() => handleExplainIssue(issue)}>
                      <strong>#{issue.number}:</strong> {issue.title}
                    </div>
                    {selectedIssue?.id === issue.id && explanation && (
                      <div className="explanation">
                        <p><strong>Summary:</strong> {explanation.simpleSummary}</p>
                        <p><strong>Why it matters:</strong> {explanation.whyItMatters}</p>
                        <p><strong>Difficulty:</strong> {explanation.difficulty}</p>
                        <p><strong>Estimated time:</strong> {explanation.estimatedTime}</p>
                        
                        <button 
                          onClick={() => handleGetStartHereGuide(issue)}
                          className="guide-btn"
                          disabled={guideLoading}
                        >
                          {guideLoading ? 'Loading...' : 'Get Start Here Guide'}
                        </button>
                        
                        {guide && guide.files && (
                          <div className="guide-section">
                            <h4>Start Here Guide</h4>
                            <p>{guide.summary}</p>
                            <h5>Files to Edit:</h5>
                            <ul>
                              {guide.files.map((file, idx) => (
                                <li key={idx}>
                                  <strong>{file.path}</strong>
                                  <p><strong>Purpose:</strong> {file.purpose}</p>
                                  <p><strong>Changes needed:</strong> {file.changes}</p>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="empty-state">
                <p>No beginner-friendly issues found in this repository.</p>
              </div>
            )}
          </div>
        )}

        {!summary && !loading && (
          <div className="empty-state" style={{ marginTop: '60px', fontSize: '16px', color: '#999' }}>
            <p>Paste a GitHub repo URL above to get started</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;