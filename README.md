# SkillForge — AI-Powered Mock Interview Platform

<div align="center">

**Practice real voice interviews with AI. Get live transcription, detailed scoring, and personalized feedback — all tailored to your target role.**

[Live Demo](http://localhost:3000) · [Report Bug](https://github.com/rustamali-07/ai_interview/issues) · [Request Feature](https://github.com/rustamali-07/ai_interview/issues)

</div>

---

## 📌 About The Project

SkillForge is an AI-powered mock interview platform that simulates real job interviews using voice-based AI. Built as an academic project, it helps students and job seekers practice and improve their interview skills with instant, detailed feedback.

### Key Highlights

- 🎙️ **Real-time voice interviews** with AI (powered by Vapi + OpenAI)
- 📝 **Live transcription** of every conversation
- 📊 **Detailed scoring** across 5 dimensions with per-answer breakdowns
- 🎯 **14+ job roles** with role-specific question banks
- 📈 **Performance tracking** with score trends and skill radar charts
- 💡 **AI-generated tips**, model answers, and improvement roadmaps
- 🎥 **Webcam recording** and playback for self-review
- 💳 **Pricing plans** — Basic ($3/mo), Pro ($9/mo), Max ($19/mo)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router, Turbopack) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS 4, Framer Motion |
| **UI Components** | Radix UI (shadcn/ui) |
| **Authentication** | [Clerk](https://clerk.com/) |
| **Database** | [Supabase](https://supabase.com/) (PostgreSQL) |
| **AI Voice** | [Vapi](https://vapi.ai/) (Real-time voice AI) |
| **AI Scoring** | [OpenRouter](https://openrouter.ai/) (GPT-4 / auto-model) |
| **State Management** | Zustand |
| **Deployment** | Vercel |

---

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Landing page
│   ├── layout.tsx                # Root layout (Clerk, fonts, Toaster)
│   ├── pricing/page.tsx          # Pricing plans page
│   ├── dashboard/page.tsx        # User dashboard
│   ├── history/page.tsx          # Interview history
│   ├── interview/
│   │   ├── setup/page.tsx        # Interview configuration wizard
│   │   └── [sessionId]/page.tsx  # Live interview room
│   ├── feedback/
│   │   └── [sessionId]/page.tsx  # Post-interview feedback & scores
│   ├── api/
│   │   ├── gemini/score/         # AI scoring endpoint (OpenRouter)
│   │   └── interview/            # Interview CRUD APIs (Supabase)
│   ├── sign-in/                  # Clerk sign-in page
│   └── sign-up/                  # Clerk sign-up page
├── components/
│   ├── dashboard/                # StatsCard, SkillRadar, RecentSessions
│   ├── feedback/                 # ScoreCard, CategoryScore, AnswerReview, ImprovementTips
│   ├── interview/                # LiveInterviewRoom, AIAvatar, TranscriptPanel, Timer
│   ├── shared/                   # Navbar, Footer, DifficultyBadge, RoleSelector
│   └── ui/                       # Reusable UI primitives (button, dialog, tabs, etc.)
├── hooks/                        # useInterviewAI, useInterviewSession
├── store/                        # Zustand stores (interviewStore, userStore)
├── lib/                          # Utilities (supabase client, prompts, scoring)
├── types/                        # TypeScript type definitions
└── middleware.ts                 # Clerk auth middleware
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** (comes with Node.js)
- Accounts on: [Clerk](https://clerk.com/), [Supabase](https://supabase.com/), [Vapi](https://vapi.ai/), [OpenRouter](https://openrouter.ai/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rustamali-07/ai_interview.git
   cd ai_interview
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:
   ```env
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
   CLERK_SECRET_KEY=sk_...
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

   # Supabase Database
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

   # Vapi Voice AI
   NEXT_PUBLIC_VAPI_PUBLIC_KEY=your_vapi_public_key
   NEXT_PUBLIC_VAPI_ASSISTANT_ID=your_assistant_id  # optional
   VAPI_API_KEY=your_vapi_secret_key

   # OpenRouter (AI Scoring)
   OPENROUTER_API_KEY=sk-or-...
   ```

4. **Set up Supabase database**

   Create an `interviews` table with these columns:
   | Column | Type | Notes |
   |--------|------|-------|
   | `id` | text | Primary key (session ID) |
   | `user_id` | text | Clerk user ID |
   | `role` | text | Job role |
   | `difficulty` | text | Beginner / Intermediate / Advanced |
   | `type` | text | Technical / Behavioral / Mixed |
   | `question_count` | integer | Number of questions |
   | `transcript` | jsonb | Array of transcript entries |
   | `score` | jsonb | Scoring result object |
   | `duration` | integer | Interview duration in seconds |
   | `status` | text | in-progress / completed / abandoned |
   | `completed_at` | timestamptz | Completion timestamp |
   | `created_at` | timestamptz | Auto-generated |

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📖 How It Works

```
┌─────────────┐     ┌──────────────┐     ┌───────────────┐
│  1. Setup   │────▶│  2. Practice │────▶│  3. Feedback  │
│  Pick role, │     │  Voice chat  │     │  Scores, tips │
│  difficulty │     │  with AI     │     │  & review     │
└─────────────┘     └──────────────┘     └───────────────┘
```

1. **Configure** — Pick your job role, difficulty level, interview type, and number of questions
2. **Practice** — Have a real-time voice conversation with the AI interviewer (Alex)
3. **Get Scored** — Receive detailed feedback across 5 categories: Technical Accuracy, Communication, Problem Solving, Relevance, and Depth

---

## 🎯 Supported Roles

| Role | Questions |
|------|-----------|
| Software Engineer | 50+ |
| Frontend Developer | 45+ |
| Backend Developer | 45+ |
| Full Stack Developer | 50+ |
| Data Scientist | 45+ |
| ML Engineer | 40+ |
| Product Manager | 40+ |
| DevOps Engineer | 35+ |
| Cloud Architect | 30+ |
| UX Designer | 30+ |
| Business Analyst | 35+ |
| QA Engineer | 25+ |
| Marketing Manager | 25+ |
| System Design | 35+ |

---

## 💳 Pricing

| Feature | Basic ($3/mo) | Pro ($9/mo) | Max ($19/mo) |
|---------|:---:|:---:|:---:|
| Interviews / month | 5 | 25 | Unlimited |
| Job roles | 3 | All 14+ | All + Custom |
| Scoring | Basic | Advanced breakdown | Expert analytics |
| Voice interview | ✗ | ✓ | ✓ |
| Recording & playback | ✗ | ✓ | ✓ + Export |
| Resume-tailored Qs | ✗ | ✗ | ✓ |
| Team dashboard | ✗ | ✗ | Up to 5 users |

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (Turbopack) |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## 👥 Team

This project was developed as part of our academic curriculum.

| Name | Enrollment No. |
|------|---------------|
| **Atif Shaikh** | 2207190100042 |
| **Mohd Yahiya** | 2207190100074 |
| **Rustam Ali** | 2207190100097 |

---

## 📄 License

This project is for educational purposes.

---

<div align="center">

**Built with ❤️ using Next.js, Vapi, and Google Gemini**

[⬆ Back to top](#skillforge--ai-powered-mock-interview-platform)

</div>
