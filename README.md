# HireReady AI — Next-Gen AI-Powered Interview & Placement Preparation Platform 🚀

[![Live Demo](https://img.shields.io/badge/Live_Demo-hireready--ai--wv33.vercel.app-E11D48?style=for-the-badge&logo=vercel&logoColor=white)](https://hireready-ai-wv33.vercel.app)
[![Backend API](https://img.shields.io/badge/Backend_API-hireready--ai--qmpy.onrender.com-46E3B7?style=for-the-badge&logo=render&logoColor=black)](https://hireready-ai-qmpy.onrender.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

[![React](https://img.shields.io/badge/React_18-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript_5.7-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Node.js](https://img.shields.io/badge/Node.js_20-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL_(Neon)-316192?style=flat-square&logo=postgresql&logoColor=white)](https://neon.tech)
[![MongoDB](https://img.shields.io/badge/MongoDB_(Atlas)-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

> **Created by [Amame Aazam](https://github.com/amame-aazam)**  
> **GitHub Repository:** [https://github.com/amame-aazam/Hireready-ai](https://github.com/amame-aazam/Hireready-ai)

---

## 🌐 Live Deployments

| Component | Platform | Live URL | Status |
| :--- | :--- | :--- | :--- |
| **Frontend Application** | Vercel (Hobby) | [https://hireready-ai-wv33.vercel.app](https://hireready-ai-wv33.vercel.app) | 🟢 Live |
| **Backend API Service** | Render (Web Service) | [https://hireready-ai-qmpy.onrender.com](https://hireready-ai-qmpy.onrender.com) | 🟢 Live |
| **API Health Check** | Render | [https://hireready-ai-qmpy.onrender.com/health](https://hireready-ai-qmpy.onrender.com/health) | 🟢 Healthy |
| **Relational Database** | Neon PostgreSQL | Serverless Pooled (AWS us-east-2) | 🟢 Connected |
| **Document Store** | MongoDB Atlas | M0 Replica Set Cluster | 🟢 Connected |

---

## 📖 Overview

**HireReady AI** is an enterprise-grade, full-stack recruitment simulation platform built to empower engineering students and job candidates to master technical and behavioral interviews. 

By unifying automated ATS resume screening, proctored algorithmic coding assessments, real-time voice-interactive DSA interviews, and STAR-method behavioral rounds, HireReady AI delivers an authentic hiring experience. The platform uses server-authoritative scoring across all assessment stages and automatically issues cryptographically verifiable PDF certificates to selected candidates.

---

## ✨ Key Features

- 📄 **AI Resume ATS Scanner & Skill Gap Analysis**:
  - Instant parsing of `.pdf` and `.docx` resumes with automated semantic keyword extraction.
  - Domain-aligned ATS match scoring, missing technical competencies, and tailored improvement suggestions.

- 💻 **Proctored Online Assessment (OA)**:
  - Timed multi-format exams featuring multiple-choice questions (MCQs) and coding challenges.
  - Integrated **Monaco Code Editor** with multi-language execution, custom test case validation, and real-time autosave state indicators.

- 🎙️ **Live AI Technical DSA Interview (Sophia)**:
  - Voice-interactive interviewer leveraging the Web Speech API for natural conversation.
  - **Approach-First State Machine**: Requires candidates to verbally explain their algorithmic intuition and time complexity before unlocking the code workspace.
  - 3-question progressive technical flow evaluating code correctness, runtime complexity, and technical communication.

- 🤝 **AI Behavioral HR Interview (STAR Method)**:
  - Full-screen (`100vh`) live video interview with candidate webcam feed and audio waveform visualization.
  - **Real-Time STAR Tracker**: Evaluates candidate responses across Situation, Task, Action, and Result, dynamically asking probing follow-up questions when critical components are missing.

- 📊 **Server-Authoritative Scoring & Anonymized Leaderboard**:
  - Multi-round weighted composite scoring formula: **Resume (15%) + OA (25%) + DSA (40%) + HR (20%)**.
  - Strict exclusion of incomplete candidates to maintain competitive integrity.
  - Public leaderboard featuring privacy-safe candidate aliases with rank and percentile calculation.

- 📜 **Instant Vector PDF Certificate Generation**:
  - Automatically unlocked for `SELECTED` candidates upon clearing all weighted cutoffs.
  - Client-side high-resolution A4 landscape credentials generated via `jsPDF`, complete with candidate name, score, domain, and unique verification IDs.

- 🛡️ **Comprehensive Admin Console (`/admin`)**:
  - Role-based access control (`Role.ADMIN`).
  - Platform-wide recruitment analytics, candidate application manager, and OA assessment template builder.
  - **Dual-DB Unified Report Inspector**: Inspect ATS parse trees, submitted DSA code snapshots, and HR STAR dialogue transcripts side-by-side.
  - Status overrides with audit logging.

- 🎨 **Premium Crimson & Slate Dark Theme**:
  - Modern dark aesthetic using crimson red accents (`#E11D48` / `#DC2626`) and deep zinc/slate backgrounds.
  - Persistent journey tracker guiding candidates through: `Profile ➔ Resume ➔ OA ➔ DSA ➔ HR ➔ Outcome`.

---

## 🏛️ System Architecture

```mermaid
flowchart TD
    subgraph Frontend["React Frontend (Vercel)"]
        SPA["React 18 + Vite SPA<br/><code>https://hireready-ai-wv33.vercel.app</code>"]
        JT["Candidate Journey Tracker"]
        MNC["Monaco Code Editor"]
        WSP["Web Speech & Webcam API"]
        PDF["jsPDF Certificate Engine"]
    end

    subgraph Backend["Node.js Backend (Render)"]
        API["Express + Node 20 API<br/><code>https://hireready-ai-qmpy.onrender.com</code>"]
        PROXY["<code>app.set('trust proxy', 1)</code>"]
        AUTH["Auth Module (JWT & HttpOnly Cookies)<br/><code>SameSite=None; Secure=true; path=/</code>"]
        SCORE["Server-Authoritative Scoring Engine<br/>(15% Resume + 25% OA + 40% DSA + 20% HR)"]
        ADAPTER["AI Provider Adapter Interface"]
    end

    subgraph RelationalDB["Relational Core (Neon PostgreSQL)"]
        NEON[("Neon Serverless Postgres<br/><code>(PgBouncer Connection Pooling)</code>")]
        USERS["Users & RBAC Roles"]
        APPS["Applications & Round States"]
        OAS["OA Questions & Attempts"]
        AUDIT["Audit Logs & Active Sessions"]
    end

    subgraph DocumentDB["Unstructured Core (MongoDB Atlas)"]
        ATLAS[("MongoDB Atlas M0 Cluster")]
        RES["Resume ATS Keyword Trees"]
        TRANS["DSA Voice Transcripts & Code Diffs"]
        STAR["HR STAR Logs & Dialogue Trees"]
    end

    subgraph External["AI & Sandbox Services"]
        AI["DeepSeek V3 API / MockAIProvider"]
        J0["Judge0 Sandbox Code Execution"]
    end

    SPA -->|HTTPS Requests + Cross-Origin Cookies| PROXY
    PROXY --> API
    API --> AUTH
    API --> SCORE
    API --> ADAPTER
    ADAPTER --> AI
    API --> J0
    API -->|Prisma ORM Client| NEON
    API -->|Mongoose ODM Client| ATLAS
    NEON --- USERS & APPS & OAS & AUDIT
    ATLAS --- RES & TRANS & STAR
```

---

## 🛠️ Tech Stack Breakdown

| Domain | Technologies |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, TanStack Query v5, Monaco Editor, React Router v6, Lucide Icons, jsPDF |
| **Backend** | Node.js 20, Express, TypeScript, Prisma ORM 5, Mongoose 8, Zod, Multer, bcryptjs, jsonwebtoken, Helmet, CORS |
| **Databases** | **Neon PostgreSQL** (Relational state & sessions), **MongoDB Atlas** (Conversational transcripts & reports) |
| **AI / Evaluation** | DeepSeek V3 API adapter, MockAIProvider fallback, Web Speech Synthesis & Recognition API, HTML5 MediaDevices |
| **Deployment** | **Vercel** (Frontend SPA), **Render** (Backend Web Service), **Neon** (Postgres), **Atlas** (MongoDB) |

---

## 💻 Local Setup Instructions

Follow these step-by-step instructions to run the entire platform locally on your machine.

### Prerequisites
- [Node.js](https://nodejs.org/) >= 18.0.0
- [npm](https://www.npmjs.com/) >= 9.0.0
- A [Neon PostgreSQL](https://neon.tech/) connection string (or local PostgreSQL instance)
- A [MongoDB Atlas](https://www.mongodb.com/atlas) connection URI (or local MongoDB Community server)

### 1. Clone the Repository
```bash
git clone https://github.com/amame-aazam/Hireready-ai.git
cd Hireready-ai
```

### 2. Install Dependencies
```bash
# Installs dependencies for root, client, and server workspaces
npm install
```

### 3. Environment Variables Configuration

#### A. Client Configuration (`client/.env`)
Create a `.env` file in the `client` directory:
```env
VITE_API_URL="http://localhost:5000"
VITE_APP_NAME="HireReady AI"
```

#### B. Server Configuration (`server/.env`)
Create a `.env` file in the `server` directory:
```env
# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL="http://localhost:5173"

# PostgreSQL (Neon) Database URLs
# Pooled connection string (with PgBouncer)
POSTGRES_PRISMA_URL="postgresql://user:password@ep-sample-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require&connect_timeout=30&pool_timeout=30&connection_limit=20"
# Direct connection string (for migrations)
POSTGRES_URL_NON_POOLING="postgresql://user:password@ep-sample.us-east-2.aws.neon.tech/neondb?sslmode=require&connect_timeout=30"
DATABASE_URL="postgresql://user:password@ep-sample-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require&connect_timeout=30&pool_timeout=30&connection_limit=20"

# MongoDB Atlas Connection URI
MONGODB_URI="mongodb+srv://user:password@cluster0.sample.mongodb.net/hireready?retryWrites=true&w=majority"

# JWT Authentication Secrets (32+ character secure strings)
JWT_ACCESS_SECRET="dev_access_secret_key_hireready_12345678"
JWT_REFRESH_SECRET="dev_refresh_secret_key_hireready_87654321"

# AI Provider Configuration ("mock" | "deepseek")
AI_PROVIDER=mock
DEEPSEEK_API_KEY=""
DEEPSEEK_BASE_URL="https://api.deepseek.com"

# Code Execution Sandbox
JUDGE0_MOCK=true
JUDGE0_API_KEY=""
JUDGE0_API_HOST="judge0-ce.p.rapidapi.com"
```

### 4. Database Initialization & Admin Seeding
```bash
cd server

# Generate Prisma Client
npx prisma generate

# Push database schema to PostgreSQL
npx prisma db push

# Seed initial Administrator user
npx tsx src/scripts/seed-admin.ts

cd ..
```

*Default Seeded Admin Credentials:*
- **Email**: `admin@hireready.ai`
- **Password**: `Admin@123456`

### 5. Start Development Servers
Run both backend and frontend concurrently from the root directory:
```bash
npm run dev:all
```
- **Backend API**: `http://localhost:5000`
- **Frontend App**: `http://localhost:5173`
- **Health Check**: `http://localhost:5000/health`
- **DB Health Check**: `http://localhost:5000/api/health/db`

---

## 🌐 Production Deployment Architecture

- **Frontend (Vercel)**:
  - Framework: `Vite` | Root Directory: `client`
  - Build Command: `npm run build` | Output Directory: `dist`
  - Environment Variables: `VITE_API_URL=https://hireready-ai-qmpy.onrender.com`
  - SPA Routing: Handled by `client/vercel.json` rewrites.
- **Backend (Render)**:
  - Runtime: `Node` | Root Directory: `server`
  - Build Command: `npm install && npx prisma generate && npm run build`
  - Start Command: `npm run start`
  - Configuration: Auto-managed via `render.yaml`
  - Cross-Origin Security: `app.set('trust proxy', 1)` and `SameSite=None; Secure=true` cookies.
- **Databases**:
  - **Neon PostgreSQL**: Serverless auto-scaling compute with connection pooling.
  - **MongoDB Atlas**: High-availability M0 Replica Set with `0.0.0.0/0` network whitelist.

---

## 👤 Author

**Amame Aazam**
- GitHub: [@amame-aazam](https://github.com/amame-aazam)
- Repository: [https://github.com/amame-aazam/Hireready-ai](https://github.com/amame-aazam/Hireready-ai)

---

## 📄 License

This project is open-source software licensed under the [MIT License](LICENSE).  
Copyright © 2026 **Amame Aazam**. All rights reserved.
