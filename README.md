# HireReady AI

HireReady AI is an AI-powered interview preparation platform designed to help candidates prepare for technical (DSA) and behavioral (HR) interviews with real-time turn-based dialogue, automated ATS resume scoring, and mock assessments.

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, TanStack Query, Monaco Editor
- **Backend**: Node.js, Express, TypeScript, Prisma ORM
- **Databases**:
  - PostgreSQL (Neon) for relational state (users, applications, sessions)
  - MongoDB Atlas for unstructured document state (transcripts, ATS analyses, evaluation reports)
- **AI**: DeepSeek API with adapter pattern (and local Mock AI provider)
- **Deployment**:
  - Frontend: Vercel (Hobby)
  - Backend: Render (Free)
  - Databases: Neon Serverless Postgres + MongoDB Atlas

## Getting Started

### Prerequisites
- Node.js >= 18
- npm >= 9

### Installation & Local Setup

```bash
# Clone the repository and install dependencies
cd client && npm install
cd ../server && npm install
```

### Environment Variables

Configure `.env` files in both `client/` and `server/` using the provided `.env.example` templates.

### Running in Development

```bash
# Run server (default: port 5000)
npm run dev:server

# Run client (default: port 5173)
npm run dev:client
```
