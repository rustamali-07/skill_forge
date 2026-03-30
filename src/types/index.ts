export type Difficulty = "Beginner" | "Intermediate" | "Advanced";
export type InterviewType = "Technical" | "Behavioral" | "Mixed";
export type InterviewStatus = "idle" | "setup" | "in-progress" | "completed" | "abandoned";

export interface TranscriptEntry {
  speaker: "ai" | "user";
  text: string;
  timestamp: number;
}

export interface InterviewSetup {
  role: string;
  difficulty: Difficulty;
  type: InterviewType;
  questionCount: number;
  resumeText?: string;
}

export interface CategoryScore {
  score: number;
  max: number;
  feedback: string;
}

export interface AnswerReview {
  question: string;
  studentAnswer: string;
  score: number;
  whatWasGood: string;
  improvement: string;
  modelAnswer: string;
}

export interface ScoreResult {
  totalScore: number;
  grade: string;
  categories: {
    communication: CategoryScore;
    technical: CategoryScore;
    problemSolving: CategoryScore;
    confidence: CategoryScore;
    structure: CategoryScore;
  };
  answers: AnswerReview[];
  summary: string;
  strengths: string[];
  improvements: string[];
  nextSteps: string[];
}

export interface InterviewSession {
  id: string;
  userId: string;
  role: string;
  difficulty: Difficulty;
  type: InterviewType;
  questionCount: number;
  transcript: TranscriptEntry[];
  score?: ScoreResult;
  duration: number;
  createdAt: number;
  status: "in-progress" | "completed" | "abandoned";
}

export interface UserProfile {
  name: string;
  email: string;
  totalInterviews: number;
  averageScore: number;
  createdAt: number;
}

export const JOB_ROLES = [
  { id: "software-engineer", label: "Software Engineer", category: "Engineering" },
  { id: "frontend-developer", label: "Frontend Developer", category: "Engineering" },
  { id: "backend-developer", label: "Backend Developer", category: "Engineering" },
  { id: "fullstack-developer", label: "Full Stack Developer", category: "Engineering" },
  { id: "data-scientist", label: "Data Scientist", category: "Data & AI" },
  { id: "ml-engineer", label: "ML Engineer", category: "Data & AI" },
  { id: "devops-engineer", label: "DevOps Engineer", category: "Engineering" },
  { id: "product-manager", label: "Product Manager", category: "Product" },
  { id: "ux-designer", label: "UX Designer", category: "Design" },
  { id: "business-analyst", label: "Business Analyst", category: "Business" },
  { id: "marketing-manager", label: "Marketing Manager", category: "Business" },
  { id: "sales-executive", label: "Sales Executive", category: "Business" },
  { id: "hr-manager", label: "HR Manager", category: "Business" },
  { id: "finance-analyst", label: "Finance Analyst", category: "Business" },
] as const;

export const DIFFICULTIES: Difficulty[] = ["Beginner", "Intermediate", "Advanced"];
export const INTERVIEW_TYPES: InterviewType[] = ["Technical", "Behavioral", "Mixed"];
export const QUESTION_COUNTS = [5, 10, 15] as const;
