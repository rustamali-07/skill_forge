"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useInterviewStore } from "@/store/interviewStore";
import { useUserStore } from "@/store/userStore";
import { scoreInterview } from "@/lib/gemini-score";
import { InterviewSetup } from "@/types";
import { toast } from "sonner";

export function useInterviewSession() {
  const router = useRouter();
  const store = useInterviewStore();
  const { updateStats } = useUserStore();

  const createSession = useCallback(
    async (setup: InterviewSetup, userId: string) => {
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

      store.setSetup(setup);
      store.setSessionId(sessionId);
      store.startInterview();

      try {
        await fetch("/api/interview/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            action: "create",
            data: {
              userId,
              role: setup.role,
              difficulty: setup.difficulty,
              type: setup.type,
              questionCount: setup.questionCount,
              transcript: [],
              duration: 0,
            },
          }),
        });
      } catch (err) {
        console.error("Failed to create session:", err);
      }

      return sessionId;
    },
    [store]
  );

  const finalizeSession = useCallback(
    async (sessionId: string) => {
      const { transcript, setup, startTime } = store;
      if (!setup) return;

      store.endInterview();
      store.setIsScoring(true);

      try {
        // Score the interview
        const score = await scoreInterview(transcript, setup);
        store.setScore(score);

        // Update user stats
        updateStats(score.totalScore);

        const duration = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;

        // Save completed session
        await fetch("/api/interview/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            action: "complete",
            data: {
              transcript,
              score,
              duration,
            },
          }),
        });

        router.push(`/feedback/${sessionId}`);
      } catch (err) {
        console.error("Failed to finalize:", err);
        toast.error("Failed to score interview. Please try again.");
      } finally {
        store.setIsScoring(false);
      }
    },
    [store, router, updateStats]
  );

  const abandonSession = useCallback(
    async (sessionId: string) => {
      try {
        await fetch("/api/interview/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            action: "update",
            data: { status: "abandoned" },
          }),
        });
      } catch (err) {
        console.error("Failed to abandon session:", err);
      }

      store.reset();
      router.push("/dashboard");
    },
    [store, router]
  );

  return { createSession, finalizeSession, abandonSession };
}
