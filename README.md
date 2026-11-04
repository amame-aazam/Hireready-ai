# HireReady AI — Next-Gen AI Interview & Assessment Platform 🚀

[![License: MIT](https://img.shields.io/badge/License-MIT-rose.svg)](LICENSE)
[![React](https://img.shields.io/badge/Frontend-React_18_%2B_Vite-blue.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6.svg)](https://www.typescriptlang.org)
[![Node.js](https://img.shields.io/badge/Backend-Node.js_20_%2B_Express-339933.svg)](https://nodejs.org)
[![PostgreSQL](https://img.shields.io/badge/Database-Neon_PostgreSQL-00E599.svg)](https://neon.tech)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB_Atlas-47A248.svg)](https://www.mongodb.com/atlas)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS_(Crimson_%26_Slate)-06B6D4.svg)](https://tailwindcss.com)

> **Created by [Amame Aazam](https://github.com/amame-aazam)**  
> **GitHub Repository:** [https://github.com/amame-aazam/Hireready-ai](https://github.com/amame-aazam/Hireready-ai)

---

## 📖 Overview

**HireReady AI** is an enterprise-grade placement preparation and interview simulation platform designed to bridge the gap between academic preparation and real-world tech recruitment. 

Powered by intelligent AI personas, turn-based Web Speech voice synthesis, and real-time code evaluation, HireReady AI simulates complete recruitment drives — from automated ATS resume qualification to rigorous technical and behavioral evaluation rounds — culminating in server-verified weighted scoring and downloadable PDF credentials.

---

## 🌟 Key Features

- 🎙️ **Voice-Interactive Technical DSA Interview (Sophia)**:
  - Turn-based real-time voice interaction powered by the Web Speech API.
  - **Approach-First State Machine**: Requires candidates to explain their algorithmic intuition before unlocking the code editor.
  - 3-question progressive flow evaluating code correctness, time/space complexity, and technical articulation.

- 🤝 **Behavioral HR Interview (STAR Method)**:
  - Natural back-and-forth dialogue with Sophia in a 100vh fitted video interview room.
  - Live webcam feed integration with an active audio sound-wave visualizer.
  - **Real-Time STAR Tracker**: Evaluates answers across Situation, Task, Action, and Result, with dynamic probing for missing components.

- 💻 **Proctored Online Assessment (OA)**:
  - Timed multi-question assessments featuring MCQs and algorithmic coding challenges.
  - Integrated **Monaco Code Editor** with multi-language execution, custom test case runners, and real-time autosave indicators.

- 📄 **AI Resume ATS Scanner**:
  - Instant parsing of `.pdf` and `.docx` resumes with automated semantic matching against targeted software engineering domains.
  - Detailed score breakdown, missing keyword alerts, and actionable recommendations.

- 📜 **Server-Side Scoring Engine & Vector PDF Certificate**:
  - Multi-round weighted composite scoring formula: **Resume (15%) + OA (25%) + DSA (40%) + HR (20%)**.
  - Strict exclusion of incomplete candidates and privacy-safe masked public leaderboard.
  - Instant client-side A4 landscape credential generation with unique verification hashes for `SELECTED` candidates.

- 🛡️ **Comprehensive Admin Dashboard (`/admin`)**:
  - RBAC-guarded administrator portal (`Role.ADMIN`).
  - Real-time platform statistics, candidate management directory, and OA template creation studio.
  - **Dual-DB Unified Report Inspector**: Inspect ATS parse trees, DSA code submissions, and HR dialogue transcripts side-by-side.
  - Status overrides with tamper-evident audit logging.

- 🎨 **Premium Crimson & Slate Dark Theme**:
  - Polished SaaS aesthetic utilizing crimson red accents (`#E11D48` / `#DC2626`), clean slate backgrounds, and a persistent step-by-step candidate journey tracker.

---

## 🏗️ Architecture & Data Flow

HireReady AI employs a modern split-architecture with a dual-database design:

```mermaid
flowchart TD
    subgraph Client["Frontend Client (Vercel)"]
        SPA["React 18 + Vite SPA<br/><code>https://hireready-ai.vercel.app</code>"]
        JT["Candidate Journey Tracker"]
        CE["Monaco Code Editor"]
        WSA["Web Speech & Webcam API"]
        PDF["jsPDF Certificate Engine"]
    end

    subgraph Server["Backend API (Render)"]
        API["Node.js + Express API<br/><code>https://hireready-api.onrender.com</code>"]
        PROXY["<code>app.set('trust proxy', 1)</code>"]
        AUTH["Auth Module & Token Rotation<br/><code>SameSite=None; Secure=true; path=/</code>"]
        SE["Server-Side Weighted Scoring Engine"]
        AI["AI Provider Adapter (DeepSeek / MockAI)"]
    end

    subgraph RelationalDB["Relational Core: Neon PostgreSQL"]
        PG[("Neon Serverless Postgres<br/><code>(PgBouncer Pooled)</code>")]
        USERS["Users & RBAC Roles"]
        APPS["Applications & Round States"]
        OA["OA Templates & Submissions"]
        AUDIT["Audit Logs & Token Blacklist"]
    end

    subgraph DocumentDB["Unstructured Core: MongoDB Atlas"]
        M0[("MongoDB Atlas M0 Cluster")]
        ATS["Resume ATS Parse Trees"]
        TRANS["DSA Voice Transcripts & Code Diffs"]
        STAR["HR Behavioral Logs & STAR Evaluations"]
    end

    SPA -->|HTTPS + HttpOnly Cookies| PROXY
    PROXY --> API
    API --> AUTH
    API --> SE
    API --> AI
    API -->|Prisma ORM Client| PG
    API -->|Mongoose ODM| M0
    PG --- USERS & APPS & OA & AUDIT
    M0 --- ATS & TRANS & STAR
```

---

## 🛠️ Tech Stack

| Domain | Technologies |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, TanStack Query v5, Monaco Editor, React Router v6, Lucide Icons, jsPDF |
| **Backend** | Node.js 20, Express, TypeScript, Prisma ORM 5, Mongoose 8, Zod, Multer, bcryptjs, jsonwebtoken, Helmet, CORS |
| **Databases** | **Neon PostgreSQL** (Relational state & sessions), **MongoDB Atlas** (Conversational transcripts & reports) |
| **AI / Voice** | DeepSeek API adapter, MockAIProvider fallback, Web Speech Synthesis & Recognition API, HTML5 MediaDevices |
| **Deployment** | **Vercel** (Frontend SPA), **Render** (Backend Web Service), **Neon** (Postgres), **Atlas** (MongoDB) |

---

## 💻 Getting Started (Local Setup)

### Prerequisites
- [Node.js](https://nodejs.org/) >= 18.0.0
- [npm](https://www.npmjs.com/) >= 9.0.0
- A [Neon PostgreSQL](https://neon.tech/) connection string (or local PostgreSQL)
- A [MongoDB Atlas](https://www.mongodb.com/atlas) connection URI (or local MongoDB)

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

### 3. Environment Configuration

Create `.env` files in both `client/` and `server/` using the provided templates:

**Client (`client/.env`)**:
```env
VITE_API_URL="http://localhost:5000"
VITE_APP_NAME="HireReady AI"
```

**Server (`server/.env`)**:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL="http://localhost:5173"

# PostgreSQL (Neon)
POSTGRES_PRISMA_URL="postgresql://user:password@ep-sample-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"
POSTGRES_URL_NON_POOLING="postgresql://user:password@ep-sample.us-east-2.aws.neon.tech/neondb?sslmode=require"
DATABASE_URL="postgresql://user:password@ep-sample-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"

# MongoDB Atlas
MONGODB_URI="mongodb+srv://user:password@cluster0.sample.mongodb.net/hireready?retryWrites=true&w=majority"

# JWT Secrets
JWT_ACCESS_SECRET="dev_access_secret_key_hireready_12345678"
JWT_REFRESH_SECRET="dev_refresh_secret_key_hireready_87654321"

# AI Provider ("mock" | "deepseek")
AI_PROVIDER=mock
DEEPSEEK_API_KEY=""
DEEPSEEK_BASE_URL="https://api.deepseek.com"

# Code Execution Sandbox
JUDGE0_MOCK=true
```

### 4. Database Setup & Migrations
```bash
cd server

# Generate Prisma Client
npx prisma generate

# Push schema directly to database
npx prisma db push

# Seed initial Administrator account
npx tsx src/scripts/seed-admin.ts

cd ..
```

*Default Admin Credentials:*
- **Email**: `admin@hireready.ai`
- **Password**: `Admin@123456`

### 5. Run the Application
```bash
# Starts both Backend (http://localhost:5000) and Frontend (http://localhost:5173)
npm run dev:all
```

---

## 🌐 Production Deployment

The project is pre-configured for seamless cloud deployment:

- **Frontend (Vercel)**:
  - Framework: `Vite` | Root Directory: `client`
  - Build Command: `npm run build` | Output Directory: `dist`
  - Environment Variables: `VITE_API_URL`
  - SPA Routing: Handled by `client/vercel.json` rewrites.
- **Backend (Render)**:
  - Runtime: `Node` | Root Directory: `server`
  - Build Command: `npm install && npx prisma generate && npm run build`
  - Start Command: `npm run start`
  - Port: `10000` (via `PORT` environment variable)
  - Security: `app.set('trust proxy', 1)` and `SameSite=None; Secure=true` cookies for cross-origin authentication.
- **Databases**:
  - **Neon Serverless PostgreSQL**: Auto-scaling connection-pooled SQL storage.
  - **MongoDB Atlas**: High-availability M0 Replica Set (IP Access: `0.0.0.0/0`).

---

## 👤 Author

**Amame Aazam**
- GitHub: [@amame-aazam](https://github.com/amame-aazam)
- Repository: [https://github.com/amame-aazam/Hireready-ai](https://github.com/amame-aazam/Hireready-ai)

---

## 📄 License

This project is open-source software licensed under the [MIT License](LICENSE).  
Copyright © 2026 **Amame Aazam**. All rights reserved.
