# HireReady AI 🚀

[![License: MIT](https://img.shields.io/badge/License-MIT-rose.svg)](LICENSE)
[![React](https://img.shields.io/badge/Frontend-React_18_%2B_Vite-blue.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6.svg)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-Crimson_%26_Slate-06B6D4.svg)](https://tailwindcss.com)
[![Prisma](https://img.shields.io/badge/ORM-Prisma_5-2D3748.svg)](https://www.prisma.io)
[![PostgreSQL](https://img.shields.io/badge/Database-Neon_Serverless_Postgres-00E599.svg)](https://neon.tech)
[![MongoDB](https://img.shields.io/badge/Document_Store-MongoDB_Atlas-47A248.svg)](https://www.mongodb.com/atlas)

> **Created & Developed by [Amame Aazam](https://github.com/amame-aazam)**  
> **Repository:** [https://github.com/amame-aazam/Hireready-ai](https://github.com/amame-aazam/Hireready-ai)

An end-to-end AI-powered technical and behavioral placement preparation platform with real-time interactive voice interviews, automated ATS resume scoring, proctored online assessments, and instant PDF credentials.

---

## 🔗 Live Deployments

| Component | Platform | Deployment URL | Status |
| :--- | :--- | :--- | :--- |
| **Frontend Application** | Vercel (Hobby) | [https://hireready-ai.vercel.app](https://hireready-ai.vercel.app) | Production Ready |
| **Backend API** | Render (Free Web Service) | [https://hireready-api.onrender.com](https://hireready-api.onrender.com) | Production Ready |
| **API Health Check** | Render | [https://hireready-api.onrender.com/health](https://hireready-api.onrender.com/health) | Live |
| **Relational Database** | Neon PostgreSQL | Serverless Pooled Instance (AWS us-east-2) | Active |
| **Document Database** | MongoDB Atlas | M0 Replica Set Cluster | Active |

---

## 🏗️ Architecture & Tech Stack

HireReady AI uses a modern split-architecture with a dual-database design pattern:

```
┌─────────────────────────────────┐        ┌──────────────────────────────────┐
│      Client (Vercel SPA)        │        │     Backend (Render Service)     │
│  React 18 + TypeScript + Vite   │───────▶│     Node.js + Express + Prisma   │
│  Tailwind (Crimson Dark Theme)  │ HTTPS  │  SameSite=None; Secure=true Auth │
│  Monaco Editor + jsPDF          │        │  trust proxy 1 + CORS Allowlist  │
└─────────────────────────────────┘        └─────────────────┬────────────────┘
                                                             │
                              ┌──────────────────────────────┴──────────────────────────────┐
                              ▼                                                             ▼
               ┌──────────────────────────────┐                              ┌──────────────────────────────┐
               │    Neon PostgreSQL (Prisma)  │                              │     MongoDB Atlas (Mongoose) │
               │  - User Auth & RBAC (Admin)  │                              │  - Resume ATS Parse Trees    │
               │  - Application States        │                              │  - DSA Voice Transcripts     │
               │  - OA Attempts & Scores      │                              │  - HR STAR Behavioral Logs   │
               │  - Audit Logs & Sessions     │                              │  - Detailed Feedback Reports │
               └──────────────────────────────┘                              └──────────────────────────────┘
```

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS (Crimson Red `#E11D48` & Slate Dark Theme), TanStack Query, Monaco Editor, Lucide Icons, jsPDF.
- **Backend**: Node.js, Express, TypeScript, Prisma ORM, Mongoose.
- **Databases**:
  - **Neon PostgreSQL**: Structured state, relational integrity, applications, rounds, user roles, audit trails.
  - **MongoDB Atlas**: Unstructured conversational dialogues, STAR interview evaluations, code snapshots, ATS keyword trees.
- **AI & Evaluation**: DeepSeek V3 API adapter with zero-cost offline `MockAIProvider` fallback for voice dialogue & evaluation.
- **Security**: HttpOnly cross-origin cookies (`SameSite=None; Secure=true; path=/`), bcrypt password hashing, JWT token rotation, role-based access control (`STUDENT` / `ADMIN`).

---

## 🌟 Key Platform Features

1. **Dynamic Student Journey Tracker**: Persistent visual milestone stepper tracking progress across `Profile ➔ Resume/ATS ➔ Online OA ➔ AI DSA ➔ AI HR ➔ Final Result`.
2. **AI Resume ATS Scanner**: Upload `.pdf` / `.docx` resumes for instant ATS match scoring, missing critical keywords, and domain-aligned recommendations.
3. **Timed Online Assessment (OA)**: Auto-proctored environment with MCQ questions, Monaco coding IDE, multi-language support, automated test-case runner, and autosave state preservation.
4. **AI Technical DSA Interview (Sophia)**:
   - Voice-interactive interviewer using Web Speech API synthesis & speech recognition.
   - **Approach-First State Machine**: Requires candidate to explain their approach before unlocking the code workspace.
   - 3-question structured technical round evaluating code correctness, time complexity, and technical articulation.
5. **AI Behavioral HR Interview (Sophia)**:
   - Live turn-based voice interview with webcam video integration and audio waveform visualizer.
   - Real-time **STAR Tracker** (Situation, Task, Action, Result) that actively probes for missing components.
6. **Server-Side Scoring Engine & Vector PDF Certificate**:
   - Weighted composite formula: **Resume (15%) + OA (25%) + DSA (40%) + HR (20%)**.
   - Strict incomplete candidate exclusion and privacy-masked public leaderboard.
   - Instant client-side A4 landscape credential generation with unique verification hashes for selected candidates.
7. **Admin Management Console (`/admin`)**:
   - RBAC-guarded administrative dashboard.
   - Platform metrics, OA assessment studio, and candidate directory.
   - **Dual-DB Unified Report Inspector**: Inspect ATS metrics, DSA code submissions, and HR dialogue transcripts side-by-side.
   - Status overrides with tamper-evident audit logging.

---

## 🚀 Deployment Guide

### 1. Frontend on Vercel (Hobby Tier)

1. Connect your GitHub repository to Vercel.
2. Select the **Vite** framework preset.
3. Set **Root Directory** to `client`.
4. Build Settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Configure Environment Variables:
   - `VITE_API_URL`: `https://<your-render-service>.onrender.com`
   - `VITE_APP_NAME`: `HireReady AI`
6. `client/vercel.json` contains SPA routing rewrites to ensure deep links (`/dashboard`, `/admin`) resolve smoothly:
   ```json
   {
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```

### 2. Backend on Render (Free Web Service)

1. Create a new **Web Service** on Render and link your GitHub repository.
2. Set **Root Directory** to `server`.
3. Set **Runtime** to `Node`.
4. Build & Start Commands:
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npm run start`
5. Environment Variables:
   | Variable | Value | Description |
   | :--- | :--- | :--- |
   | `NODE_ENV` | `production` | Enables production security & optimizations |
   | `PORT` | `10000` | Port assigned by Render |
   | `CLIENT_URL` | `https://<your-vercel-app>.vercel.app` | Vercel frontend URL (no trailing slash) |
   | `POSTGRES_PRISMA_URL` | *(Neon pooled connection string)* | Pooled PostgreSQL URL with `sslmode=require` |
   | `POSTGRES_URL_NON_POOLING` | *(Neon direct connection string)* | Direct PostgreSQL URL for migrations |
   | `DATABASE_URL` | *(Same as `POSTGRES_PRISMA_URL`)* | Fallback for Prisma CLI |
   | `MONGODB_URI` | *(MongoDB Atlas connection string)* | Cluster URI with database name `/hireready` |
   | `JWT_ACCESS_SECRET` | *(32+ character random string)* | Secret for access tokens |
   | `JWT_REFRESH_SECRET` | *(32+ character random string)* | Secret for refresh tokens |
   | `COOKIE_SECURE` | `true` | Enforces HTTPS-only cookies |
   | `AI_PROVIDER` | `mock` *(or `deepseek`)* | AI Interview provider |
   | `DEEPSEEK_API_KEY` | *(Optional if using mock)* | DeepSeek API Key |
   | `JUDGE0_MOCK` | `true` | In-memory code evaluation |

### 3. Database Initialization & Admin Seeding

Once deployed, open the **Shell** tab in your Render service and seed the default administrator account:

```bash
npx tsx src/scripts/seed-admin.ts
```

- **Default Admin Email**: `admin@hireready.ai`
- **Default Admin Password**: `Admin@123456`

---

## 💻 Local Development Setup

### Prerequisites
- Node.js >= 18
- npm >= 9
- PostgreSQL (or free Neon instance)
- MongoDB (or local MongoDB Community / Atlas free tier)

### 1. Clone & Install
```bash
git clone https://github.com/amame-aazam/Hireready-ai.git
cd Hireready-ai

# Install all workspace dependencies
npm install
```

### 2. Configure Environment Files
Copy example configs into respective directories:
```bash
cp client/.env.example client/.env
cp server/.env.example server/.env
```

### 3. Initialize Prisma & Run Migrations
```bash
cd server
npx prisma generate
npx prisma migrate dev --name init
npx tsx src/scripts/seed-admin.ts
cd ..
```

### 4. Start Development Servers
```bash
# Starts backend on http://localhost:5000 and frontend on http://localhost:5173
npm run dev:all
```

---

## 👤 Author

**Amame Aazam**
- GitHub: [@amame-aazam](https://github.com/amame-aazam)
- Repository: [https://github.com/amame-aazam/Hireready-ai](https://github.com/amame-aazam/Hireready-ai)

---

## 🛡️ License

This project is licensed under the [MIT License](LICENSE) - see the [LICENSE](LICENSE) file for details.
