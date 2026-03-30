"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Star, Lightbulb, CheckCircle2 } from "lucide-react";
import { AnswerReview as AnswerReviewType } from "@/types";
import { cn } from "@/lib/utils";

interface AnswerReviewProps {
  answer: AnswerReviewType;
  index: number;
}

export function AnswerReview({ answer, index }: AnswerReviewProps) {
  const [isOpen, setIsOpen] = useState(false);

  const scoreColor =
    answer.score >= 8
      ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
      : answer.score >= 6
      ? "text-teal-400 bg-teal-500/10 border-teal-500/30"
      : answer.score >= 4
      ? "text-amber-400 bg-amber-500/10 border-amber-500/30"
      : "text-rose-400 bg-rose-500/10 border-rose-500/30";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden"
    >
      <button
        className="flex w-full items-start justify-between gap-4 p-4 text-left hover:bg-white/[0.03] transition-colors"
        onClick={() => setIsOpen((o) => !o)}
      >
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <span className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-white/[0.06] text-xs font-bold text-slate-400">
            {index + 1}
          </span>
          <p className="text-sm font-medium text-white leading-snug line-clamp-2">
            {answer.question}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-sm font-bold", scoreColor)}>
            {answer.score}/10
          </span>
          {isOpen ? (
            <ChevronUp className="h-4 w-4 text-slate-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-slate-500" />
          )}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/[0.06] px-4 pb-4 pt-4 space-y-4">
              {/* Student answer */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                  Your Answer
                </p>
                <p className="text-sm text-slate-400 leading-relaxed font-mono bg-white/[0.03] rounded-lg p-3 border border-white/[0.04]">
                  {answer.studentAnswer || "No answer recorded"}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {/* What was good */}
                <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/15 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-xs font-semibold text-emerald-400">What was good</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{answer.whatWasGood}</p>
                </div>

                {/* Improvement */}
                <div className="rounded-lg bg-amber-500/5 border border-amber-500/15 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
                    <span className="text-xs font-semibold text-amber-400">Improvement</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{answer.improvement}</p>
                </div>
              </div>

              {/* Model answer */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-3.5 w-3.5 text-violet-400" />
                  <span className="text-xs font-semibold text-violet-400">Model Answer</span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed bg-violet-500/5 border border-violet-500/15 rounded-lg p-3">
                  {answer.modelAnswer}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
