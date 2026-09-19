# 🔍 CodeLens

### Understand any GitHub repository. Find where to contribute.

CodeLens is an AI-powered developer tool that helps developers understand unfamiliar GitHub repositories and discover beginner-friendly contribution opportunities.

Paste a repository URL to get an AI-generated repository analysis, beginner-friendly issues, issue explanations, and a **"Start Here" guide** showing which files to explore and modify.

**🌐 Live Demo:** https://code-lens-indol.vercel.app/

---

## ✨ Features

### 📋 Repository Analysis

* Repository summary and key features
* Technology stack detection
* Project structure overview
* Difficulty estimation
* AI-powered codebase insights

### 🐛 Beginner-Friendly Issues

* Filters `good first issue`, `beginner`, `easy`, and `help wanted` issues
* Converts technical issues into plain English
* Explains why an issue matters
* Provides difficulty and estimated time

### 📍 Start Here Guide

* Identifies relevant files for an issue
* Explains the purpose of each file
* Suggests what needs to be changed
* Provides an overall implementation approach

---

## 🏗️ Architecture

```text
React + Vite
     │
     ▼
Node.js + Express
     │
 ┌───┼────────────┐
 ▼   ▼            ▼
GitHub  PostgreSQL  Gemini
 API      Cache      AI
```

### Request Flow

1. User submits a GitHub repository URL.
2. Backend checks the PostgreSQL cache.
3. If needed, repository data is fetched from GitHub.
4. Gemini analyzes the repository.
5. Results are cached for 24 hours.
6. Frontend displays the analysis and beginner-friendly issues.
7. Selecting an issue generates a file-level **Start Here** guide.

---

## 🧰 Tech Stack

**Frontend**

* React
* Vite
* CSS3
* Vercel

**Backend**

* Node.js
* Express.js
* PostgreSQL
* Supabase
* Gemini API
* Render

**External APIs**

* GitHub REST API
* Google Gemini

---

## ⚡ Caching

CodeLens uses PostgreSQL as a persistent caching layer.

Repository analyses and issue data are cached for **24 hours**, reducing repeated GitHub and Gemini API requests.

```text
Request
   │
   ▼
Check Cache
   │
 ┌─┴─────────┐
 │           │
Hit         Miss
 │           │
 ▼           ▼
Return    GitHub API
             │
             ▼
         Gemini AI
             │
             ▼
        Update Cache
```

---

# 🔌 API

### `POST /api/repo/analyze`

Analyzes a repository.

```json
{
  "repoUrl": "https://github.com/facebook/react"
}
```

### `POST /api/repo/issues`

Fetches beginner-friendly issues.

```json
{
  "repoUrl": "https://github.com/facebook/react"
}
```

### `POST /api/repo/explain-issue`

Generates a beginner-friendly issue explanation.

```json
{
  "issue": {
    "number": 12345,
    "title": "Fix memory leak",
    "body": "Issue description..."
  }
}
```

### `POST /api/repo/start-here-guide`

Generates a file-by-file contribution guide.

```json
{
  "issue": {
    "number": 12345,
    "title": "Fix memory leak",
    "body": "Issue description..."
  },
  "owner": "facebook",
  "repo": "react"
}
```

---

# 🧠 Engineering Decisions

### PostgreSQL Caching

Used PostgreSQL for persistent caching so repository analyses survive backend restarts.

### 24-Hour TTL

A 24-hour cache balances data freshness with reduced API usage and AI processing.

### Backend AI Processing

Repository data is processed on the backend to keep API credentials secure and centralize GitHub, Gemini, and database operations.

### Separation of Concerns

The React frontend handles UI and user interaction, while the Express backend manages external APIs, AI processing, caching, and data operations.

---

# 🚀 Getting Started

## Prerequisites

* Node.js 18+
* GitHub Personal Access Token
* Gemini API key
* PostgreSQL database or Supabase

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Runs on:

```text
http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

Runs on:

```text
http://localhost:5173
```

### Environment Variables

**Backend**

```env
GITHUB_PAT=your_github_personal_access_token
GEMINI_API_KEY=your_gemini_api_key
DATABASE_URL=your_postgresql_connection_string
PORT=5000
```

**Frontend**

```env
VITE_API_BASE_URL=http://localhost:5000/api/repo
```

> Never commit API keys or `.env` files to the repository.

---

# ⚠️ Limitations

* Currently supports public repositories.
* GitHub API usage is subject to rate limits.
* Gemini usage is subject to API quotas.
* AI-generated explanations should be verified against the actual repository code.
* Very large repositories may require additional data filtering.

---

# 🔮 Roadmap

* [ ] User authentication
* [ ] Save favorite repositories
* [ ] Pull Request review assistant
* [ ] Repository comparison
* [ ] Private repository support
* [ ] Multilingual issue explanations
* [ ] Export contribution guides
* [ ] GSoC and Hacktoberfest integration

---

# 🤝 Contributing

Contributions are welcome.

```bash
git checkout -b feature/your-feature
git add .
git commit -m "Add your feature"
git push origin feature/your-feature
```

Open a Pull Request with a description of your changes.

---

# 📄 License

MIT License — see the `LICENSE` file for details.

---

## 👨‍💻 About

CodeLens was built to explore practical applications of AI in developer tooling, combining GitHub APIs, LLM-powered codebase analysis, REST APIs, PostgreSQL caching, and a React frontend.

> **Make the first contribution to an unfamiliar open-source project easier to understand and easier to start.**

**Built with React, Node.js, Express, PostgreSQL, GitHub API, and Gemini AI.**
