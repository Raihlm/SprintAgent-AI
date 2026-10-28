# SprintAgent AI

> **Jira-to-Code Automated Workflow** — a 2-agent AI pipeline that translates Jira tickets into production-ready code and automatically reviews submissions against Acceptance Criteria.

---

## Architecture

```
SprintAgentAI/
├── backend/                    # Node.js + Express API
│   └── src/
│       ├── index.js            # Server entrypoint, middleware, route wiring
│       ├── agents/
│       │   ├── architectAgent.js   # Architect Agent system prompt + prompt builder
│       │   └── reviewerAgent.js    # Reviewer Agent system prompt + prompt builder
│       ├── routes/
│       │   ├── architect.js    # POST /api/architect/generate
│       │   └── reviewer.js     # POST /api/reviewer/review
│       ├── middleware/
│       │   ├── requestLogger.js
│       │   └── errorHandler.js
│       └── utils/
│           └── openaiClient.js # Singleton OpenAI client + chatCompletion helper
│
└── frontend/                   # React + Vite SPA
    └── src/
        ├── App.jsx             # Root shell with tab navigation
        ├── pages/
        │   ├── ArchitectPage.jsx   # Architect Agent UI
        │   └── ReviewerPage.jsx    # Reviewer Agent UI
        ├── components/
        │   ├── TicketForm.jsx      # Shared textarea form
        │   └── AgentOutput.jsx     # Markdown renderer card
        ├── hooks/
        │   └── useAgent.js     # Generic async agent hook
        └── services/
            └── agentService.js # fetch wrappers for both API endpoints
```

---

## Agents

### Agent 1 — Architect Agent (`POST /api/architect/generate`)
- **Input:** Jira ticket text + repository folder structure
- **Output:** Full `# Technical Implementation Plan` + complete source code blocks
- **Model settings:** `temperature: 0.2`, `max_tokens: 4096`

### Agent 2 — Reviewer Agent (`POST /api/reviewer/review`)
- **Input:** Jira ticket + submitted code
- **Output:** Structured `# Automated Code Review Report` with per-criterion table, security findings, and APPROVED / NEEDS REVISION verdict
- **Model settings:** `temperature: 0.1`, `max_tokens: 2048`

---

## Getting Started

### Prerequisites
- Node.js ≥ 18
- An OpenAI API key with access to `gpt-4o` (or override `OPENAI_MODEL`)

### 1 — Backend setup

```bash
cd backend
cp .env.example .env          # then edit .env and add your OPENAI_API_KEY
npm install
npm run dev                   # starts on http://localhost:3001
```

### 2 — Frontend setup

```bash
cd frontend
npm install
npm run dev                   # starts on http://localhost:5173
```

### 3 — Open the app

Navigate to **http://localhost:5173** in your browser.

---

## API Reference

| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| GET | `/api/health` | — | `{ status, service }` |
| POST | `/api/architect/generate` | `{ jiraTicket, folderStructure }` | `{ success, result }` |
| POST | `/api/reviewer/review` | `{ jiraTicket, submittedCode }` | `{ success, verdict, result }` |

---

## Environment Variables (backend `.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3001` | Express server port |
| `OPENAI_API_KEY` | *(required)* | Your OpenAI secret key |
| `OPENAI_MODEL` | `gpt-4o` | Model to use for both agents |
| `FRONTEND_ORIGIN` | `http://localhost:5173` | CORS allowed origin |
