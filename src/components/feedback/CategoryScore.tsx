"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CategoryScore as CategoryScoreType } from "@/types";

interface CategoryScoreProps {
  name: string;
  data: CategoryScoreType;
  index?: number;
}

const categoryColors: Record<string, string> = {
  communication: "from-blue-500 to-cyan-500",
  technical: "from-teal-500 to-emerald-500",
  problemSolving: "from-violet-500 to-purple-500",
  confidence: "from-amber-500 to-orange-500",
  structure: "from-rose-500 to-pink-500",
};

const categoryIcons: Record<string, string> = {
  communication: "💬",
  technical: "⚙️",
  problemSolving: "🧠",
  confidence: "✨",
  structure: "📋",
};

export function CategoryScore({ name, data, index = 0 }: CategoryScoreProps) {
  const percentage = Math.round((data.score / data.max) * 100);
  const gradientClass = categoryColors[name] || "from-teal-500 to-violet-500";

  const displayName: Record<string, string> = {
    communication: "Communication & Clarity",
    technical: "Technical Knowledge",
    problemSolving: "Problem Solving",
    confidence: "Confidence & Presence",
    structure: "Answer Structure",
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 hover:bg-white/[0.05] transition-colors"
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">{categoryIcons[name] || "📊"}</span>
          <div>
            <p className="text-sm font-semibold text-white">{displayName[name] || name}</p>
            <p className="text-xs text-slate-500">Max {data.max} points</p>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <span className="text-xl font-bold text-white tabular-nums">{data.score}</span>
          <span className="text-sm text-slate-600">/{data.max}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 w-full rounded-full bg-white/[0.06] overflow-hidden mb-3">
        <motion.div
          className={cn("h-full rounded-full bg-gradient-to-r", gradientClass)}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, delay: index * 0.08 + 0.2, ease: "easeOut" }}
        />
      </div>

      <p className="text-xs text-slate-400 leading-relaxed">{data.feedback}</p>
    </motion.div>
  );
}
