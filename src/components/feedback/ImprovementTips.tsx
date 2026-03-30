"use client";

import { motion } from "framer-motion";
import { TrendingUp, Target, BookOpen, ArrowRight } from "lucide-react";

interface ImprovementTipsProps {
  strengths: string[];
  improvements: string[];
  nextSteps: string[];
  summary: string;
}

export function ImprovementTips({ strengths, improvements, nextSteps, summary }: ImprovementTipsProps) {
  return (
    <div className="space-y-6">
      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-5"
      >
        <p className="text-sm font-semibold text-slate-300 mb-2 uppercase tracking-wider text-xs">Overall Summary</p>
        <p className="text-sm text-slate-300 leading-relaxed">{summary}</p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Strengths */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-emerald-500/15 bg-emerald-500/[0.04] p-5"
        >
          <div className="flex items-center gap-2.5 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
            </div>
            <h3 className="text-sm font-bold text-emerald-400">Top Strengths</h3>
          </div>
          <ul className="space-y-2">
            {strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="flex-shrink-0 mt-0.5 h-4 w-4 rounded-full bg-emerald-500/20 flex items-center justify-center text-[9px] font-bold text-emerald-400">
                  {i + 1}
                </span>
                <span className="text-xs text-slate-300 leading-relaxed">{s}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Improvements */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-xl border border-amber-500/15 bg-amber-500/[0.04] p-5"
        >
          <div className="flex items-center gap-2.5 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/15">
              <Target className="h-4 w-4 text-amber-400" />
            </div>
            <h3 className="text-sm font-bold text-amber-400">Areas to Improve</h3>
          </div>
          <ul className="space-y-2">
            {improvements.map((s, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="flex-shrink-0 mt-0.5 h-4 w-4 rounded-full bg-amber-500/20 flex items-center justify-center text-[9px] font-bold text-amber-400">
                  {i + 1}
                </span>
                <span className="text-xs text-slate-300 leading-relaxed">{s}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Next steps */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-xl border border-violet-500/15 bg-violet-500/[0.04] p-5"
      >
        <div className="flex items-center gap-2.5 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/15">
            <BookOpen className="h-4 w-4 text-violet-400" />
          </div>
          <h3 className="text-sm font-bold text-violet-400">Recommended Next Steps</h3>
        </div>
        <ul className="space-y-2">
          {nextSteps.map((step, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <ArrowRight className="flex-shrink-0 h-3.5 w-3.5 mt-0.5 text-violet-400" />
              <span className="text-xs text-slate-300 leading-relaxed">{step}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
