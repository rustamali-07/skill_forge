"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Navbar } from "@/components/shared/Navbar";
import { RoleSelector } from "@/components/shared/RoleSelector";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useInterviewSession } from "@/hooks/useInterviewSession";
import {
  DIFFICULTIES,
  INTERVIEW_TYPES,
  QUESTION_COUNTS,
  InterviewSetup,
} from "@/types";
import {
  ArrowRight,
  ArrowLeft,
  Briefcase,
  BarChart3,
  MessageSquare,
  Hash,
  FileText,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const steps = [
  { id: 1, title: "Job Role", icon: Briefcase, desc: "What role are you interviewing for?" },
  { id: 2, title: "Difficulty", icon: BarChart3, desc: "Choose your challenge level" },
  { id: 3, title: "Interview Type", icon: MessageSquare, desc: "What kind of questions?" },
  { id: 4, title: "Questions", icon: Hash, desc: "How many questions?" },
  { id: 5, title: "Background", icon: FileText, desc: "Optional: add your resume/skills" },
];

export default function InterviewSetupPage() {
  const { user } = useUser();
  const router = useRouter();
  const { createSession } = useInterviewSession();

  const [step, setStep] = useState(1);
  const [isStarting, setIsStarting] = useState(false);
  const [setup, setSetup] = useState<Partial<InterviewSetup>>({
    role: "",
    difficulty: "Intermediate",
    type: "Mixed",
    questionCount: 10,
    resumeText: "",
  });

  const canProceed = () => {
    if (step === 1) return !!setup.role;
    if (step === 2) return !!setup.difficulty;
    if (step === 3) return !!setup.type;
    if (step === 4) return !!setup.questionCount;
    return true;
  };

  const handleStart = async () => {
    if (!user) return;
    if (!setup.role || !setup.difficulty || !setup.type || !setup.questionCount) {
      toast.error("Please complete all setup steps");
      return;
    }

    setIsStarting(true);
    try {
      const sessionId = await createSession(setup as InterviewSetup, user.id);
      router.push(`/interview/${sessionId}`);
    } catch {
      toast.error("Failed to create interview session");
      setIsStarting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e]">
      <Navbar />

      <div className="mx-auto max-w-3xl px-4 pt-24 pb-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="font-display text-4xl font-black text-white">
            Configure Your Interview
          </h1>
          <p className="mt-2 text-slate-400">
            Customize your mock interview experience
          </p>
        </motion.div>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2 mb-10 overflow-x-auto pb-2">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (s.id < step || (s.id === step + 1 && canProceed())) {
                    setStep(s.id);
                  }
                }}
                className={cn(
                  "flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-all whitespace-nowrap",
                  step === s.id
                    ? "bg-teal-500/20 border border-teal-500/40 text-teal-300"
                    : s.id < step
                      ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 cursor-pointer"
                      : "bg-white/[0.04] border border-white/[0.06] text-slate-600"
                )}
              >
                {s.id < step ? (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                ) : (
                  <span>{s.id}</span>
                )}
                <span className="hidden sm:inline">{s.title}</span>
              </button>
              {i < steps.length - 1 && (
                <div className="h-px w-4 bg-white/[0.06]" />
              )}
            </div>
          ))}
        </div>

        {/* Step card */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.25 }}
          className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 sm:p-8"
        >
          <div className="mb-6">
            <h2 className="font-display text-2xl font-black text-white">
              {steps[step - 1].title}
            </h2>
            <p className="mt-1 text-slate-400">{steps[step - 1].desc}</p>
          </div>

          {/* Step 1: Role */}
          {step === 1 && (
            <RoleSelector
              selected={setup.role || ""}
              onSelect={(role) => setSetup((s) => ({ ...s, role }))}
            />
          )}

          {/* Step 2: Difficulty */}
          {step === 2 && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {DIFFICULTIES.map((d) => {
                const colors = {
                  Beginner: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
                  Intermediate: "border-amber-500/40 bg-amber-500/10 text-amber-300",
                  Advanced: "border-rose-500/40 bg-rose-500/10 text-rose-300",
                };
                const descs = {
                  Beginner: "Basic concepts, gentle pace, foundational questions",
                  Intermediate: "Standard difficulty, real interview feel",
                  Advanced: "Challenging questions, expert-level probing",
                };
                return (
                  <motion.button
                    key={d}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSetup((s) => ({ ...s, difficulty: d }))}
                    className={cn(
                      "rounded-xl border-2 p-4 text-left transition-all",
                      setup.difficulty === d
                        ? colors[d]
                        : "border-white/[0.08] bg-white/[0.02] text-slate-300 hover:border-white/20 hover:bg-white/[0.04]"
                    )}
                  >
                    <p className="font-bold text-base">{d}</p>
                    <p className="text-xs mt-1 opacity-70">{descs[d]}</p>
                  </motion.button>
                );
              })}
            </div>
          )}

          {/* Step 3: Type */}
          {step === 3 && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {INTERVIEW_TYPES.map((t) => {
                const descs = {
                  Technical: "Coding, system design, technical concepts",
                  Behavioral: "STAR method, leadership, teamwork scenarios",
                  Mixed: "Blend of technical and behavioral questions",
                };
                const icons = { Technical: "⚙️", Behavioral: "💬", Mixed: "🔀" };
                return (
                  <motion.button
                    key={t}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSetup((s) => ({ ...s, type: t }))}
                    className={cn(
                      "rounded-xl border-2 p-4 text-left transition-all",
                      setup.type === t
                        ? "border-teal-500/50 bg-teal-500/10 text-teal-300"
                        : "border-white/[0.08] bg-white/[0.02] text-slate-300 hover:border-white/20 hover:bg-white/[0.04]"
                    )}
                  >
                    <span className="text-2xl mb-2 block">{icons[t]}</span>
                    <p className="font-bold text-base">{t}</p>
                    <p className="text-xs mt-1 opacity-70">{descs[t]}</p>
                  </motion.button>
                );
              })}
            </div>
          )}

          {/* Step 4: Question count */}
          {step === 4 && (
            <div className="grid grid-cols-3 gap-3">
              {QUESTION_COUNTS.map((n) => (
                <motion.button
                  key={n}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSetup((s) => ({ ...s, questionCount: n }))}
                  className={cn(
                    "rounded-xl border-2 p-6 text-center transition-all",
                    setup.questionCount === n
                      ? "border-violet-500/50 bg-violet-500/10 text-violet-300"
                      : "border-white/[0.08] bg-white/[0.02] text-slate-300 hover:border-white/20 hover:bg-white/[0.04]"
                  )}
                >
                  <p className="font-display text-4xl font-black">{n}</p>
                  <p className="text-xs mt-1 opacity-60">questions</p>
                  <p className="text-xs mt-0.5 opacity-50">~{n * 3}-{n * 5} min</p>
                </motion.button>
              ))}
            </div>
          )}

          {/* Step 5: Resume */}
          {step === 5 && (
            <div className="space-y-4">
              <Textarea
                placeholder="Paste your resume, key skills, or relevant experience here... (optional but improves question quality)"
                className="min-h-40 bg-white/[0.04] border-white/10 text-slate-200 placeholder-slate-600 resize-none font-mono text-sm focus:border-teal-500/40"
                value={setup.resumeText || ""}
                onChange={(e) =>
                  setSetup((s) => ({ ...s, resumeText: e.target.value }))
                }
              />
              <p className="text-xs text-slate-600">
                Adding your background allows Alex to ask more relevant, personalized questions
              </p>
            </div>
          )}

          {/* Summary on last step */}
          {step === 5 && (
            <div className="mt-6 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <p className="text-xs font-semibold text-slate-500 mb-3 uppercase tracking-wider">Interview Summary</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 text-sm">
                <div>
                  <p className="text-slate-600 text-xs">Role</p>
                  <p className="text-white font-medium mt-0.5 truncate">{setup.role}</p>
                </div>
                <div>
                  <p className="text-slate-600 text-xs">Difficulty</p>
                  <p className="text-white font-medium mt-0.5">{setup.difficulty}</p>
                </div>
                <div>
                  <p className="text-slate-600 text-xs">Type</p>
                  <p className="text-white font-medium mt-0.5">{setup.type}</p>
                </div>
                <div>
                  <p className="text-slate-600 text-xs">Questions</p>
                  <p className="text-white font-medium mt-0.5">{setup.questionCount}</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between">
          {step > 1 ? (
            <Button
              variant="outline"
              onClick={() => setStep((s) => s - 1)}
              className="border-white/10 text-slate-400 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <Button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canProceed()}
              className="bg-gradient-to-r from-teal-500 to-violet-500 text-white border-0 hover:opacity-90 disabled:opacity-40"
            >
              Continue
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleStart}
              disabled={isStarting}
              className="bg-gradient-to-r from-teal-500 to-violet-500 text-white border-0 hover:opacity-90 px-8"
            >
              {isStarting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Starting...
                </>
              ) : (
                <>
                  Start Interview
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
