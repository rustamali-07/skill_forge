"use client";

import { use, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useInterviewStore } from "@/store/interviewStore";
import { InterviewSession } from "@/types";
import { Navbar } from "@/components/shared/Navbar";
import { ScoreCard } from "@/components/feedback/ScoreCard";
import { CategoryScore } from "@/components/feedback/CategoryScore";
import { AnswerReview } from "@/components/feedback/AnswerReview";
import { ImprovementTips } from "@/components/feedback/ImprovementTips";
import { TranscriptPanel } from "@/components/interview/TranscriptPanel";
import { DifficultyBadge } from "@/components/shared/DifficultyBadge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Play,
  LayoutDashboard,
  PartyPopper,
  Clock,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

interface FeedbackPageProps {
  params: Promise<{ sessionId: string }>;
}

export default function FeedbackPage({ params }: FeedbackPageProps) {
  const { sessionId } = use(params);
  const { user } = useUser();
  const router = useRouter();
  const store = useInterviewStore();

  const [session, setSession] = useState<InterviewSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCelebration, setShowCelebration] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      // Try store first (immediate post-interview)
      if (store.sessionId === sessionId && store.score) {
        setSession({
          id: sessionId,
          userId: user?.id || "",
          role: store.setup?.role || "",
          difficulty: store.setup?.difficulty || "Intermediate",
          type: store.setup?.type || "Mixed",
          questionCount: store.setup?.questionCount || 10,
          transcript: store.transcript,
          score: store.score,
          duration: store.duration,
          createdAt: store.startTime || Date.now(),
          status: "completed",
        });
        setIsLoading(false);
        return;
      }

      // Poll Supabase until score arrives (max 10 × 3s = 30s)
      let attempts = 0;
      const poll = async (): Promise<void> => {
        if (cancelled) return;
        try {
          const res = await fetch(`/api/interview/${sessionId}`);
          const data = await res.json();
          if (data.session?.score) {
            if (!cancelled) {
              setSession(data.session as InterviewSession);
              setIsLoading(false);
            }
            return;
          }
        } catch (err) {
          console.error("Failed to load session:", err);
        }
        attempts++;
        if (attempts < 10) {
          setTimeout(poll, 3000);
        } else {
          if (!cancelled) setIsLoading(false);
        }
      };

      poll();
    };

    load();
    return () => { cancelled = true; };
  }, [sessionId, store, user]);

  // Dismiss celebration after 2.5s
  useEffect(() => {
    const t = setTimeout(() => setShowCelebration(false), 2500);
    return () => clearTimeout(t);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0f1e]">
        <Navbar />
        <div className="mx-auto max-w-4xl px-4 pt-24 pb-16 space-y-6">
          <Skeleton className="h-48 rounded-xl bg-white/[0.04]" />
          <Skeleton className="h-32 rounded-xl bg-white/[0.04]" />
          <div className="grid gap-3 sm:grid-cols-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl bg-white/[0.04]" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!session?.score) {
    return (
      <div className="min-h-screen bg-[#0a0f1e]">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
          <p className="text-slate-400">No feedback data found for this session.</p>
          <Button onClick={() => router.push("/dashboard")} className="bg-gradient-to-r from-teal-500 to-violet-500 text-white border-0">
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const { score } = session;

  return (
    <div className="min-h-screen bg-[#0a0f1e]">
      <Navbar />

      {/* Celebration overlay */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0f1e]/95 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="text-center"
            >
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="font-display text-3xl font-black text-white mb-2">
                Interview Complete!
              </h2>
              <p className="text-slate-400">Analyzing your performance...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 pt-24 pb-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <PartyPopper className="h-4 w-4 text-teal-400" />
                <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider">
                  Interview Results
                </span>
              </div>
              <h1 className="font-display text-3xl font-black text-white">{session.role}</h1>
              <div className="mt-2 flex items-center gap-3 flex-wrap">
                <DifficultyBadge difficulty={session.difficulty} />
                <span className="text-xs text-slate-500 border border-white/[0.08] rounded-full px-2.5 py-0.5">
                  {session.type}
                </span>
                {session.duration > 0 && (
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <Clock className="h-3 w-3" />
                    {Math.floor(session.duration / 60)}m {session.duration % 60}s
                  </span>
                )}
                <span className="text-xs text-slate-600">
                  {format(new Date(session.createdAt), "MMM d, yyyy")}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Link href="/dashboard">
                <Button variant="outline" size="sm" className="border-white/10 text-slate-400 hover:text-white">
                  <LayoutDashboard className="h-4 w-4 mr-1.5" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/interview/setup">
                <Button size="sm" className="bg-gradient-to-r from-teal-500 to-violet-500 text-white border-0">
                  <Play className="h-4 w-4 mr-1.5" />
                  New Interview
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Score hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 mb-6 text-center"
        >
          <ScoreCard score={score.totalScore} grade={score.grade} animate />
          <p className="mt-4 text-sm text-slate-400 max-w-md mx-auto">{score.summary}</p>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="breakdown" className="space-y-4">
          <TabsList className="bg-white/[0.04] border border-white/[0.06] p-1">
            <TabsTrigger
              value="breakdown"
              className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-slate-400"
            >
              Score Breakdown
            </TabsTrigger>
            <TabsTrigger
              value="answers"
              className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-slate-400"
            >
              <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
              Q&A Review ({score.answers?.length || 0})
            </TabsTrigger>
            <TabsTrigger
              value="tips"
              className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-slate-400"
            >
              Tips & Next Steps
            </TabsTrigger>
            <TabsTrigger
              value="transcript"
              className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-slate-400"
            >
              Transcript
            </TabsTrigger>
          </TabsList>

          {/* Score breakdown */}
          <TabsContent value="breakdown">
            <div className="grid gap-3 sm:grid-cols-2">
              {Object.entries(score.categories).map(([key, cat], i) => (
                <CategoryScore key={key} name={key} data={cat} index={i} />
              ))}
            </div>
          </TabsContent>

          {/* Q&A review */}
          <TabsContent value="answers">
            <div className="space-y-3">
              {score.answers?.map((answer, i) => (
                <AnswerReview key={i} answer={answer} index={i} />
              ))}
              {(!score.answers || score.answers.length === 0) && (
                <div className="text-center py-12 text-slate-600 text-sm">
                  No answer data available
                </div>
              )}
            </div>
          </TabsContent>

          {/* Tips */}
          <TabsContent value="tips">
            <ImprovementTips
              summary={score.summary}
              strengths={score.strengths}
              improvements={score.improvements}
              nextSteps={score.nextSteps}
            />
          </TabsContent>

          {/* Transcript */}
          <TabsContent value="transcript">
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden h-[500px]">
              <TranscriptPanel transcript={session.transcript || []} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
