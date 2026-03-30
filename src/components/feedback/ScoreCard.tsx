"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ScoreCardProps {
  score: number;
  grade: string;
  animate?: boolean;
  className?: string;
}

const gradeColors: Record<string, string> = {
  "A+": "text-emerald-400",
  A: "text-emerald-400",
  "B+": "text-teal-400",
  B: "text-teal-400",
  C: "text-amber-400",
  D: "text-rose-400",
};

export function ScoreCard({ score, grade, animate = true, className }: ScoreCardProps) {
  const [displayed, setDisplayed] = useState(animate ? 0 : score);
  const [progress, setProgress] = useState(animate ? 0 : score);

  useEffect(() => {
    if (!animate) return;
    const duration = 1500;
    const start = Date.now();

    const tick = () => {
      const elapsed = Date.now() - start;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      setDisplayed(Math.round(eased * score));
      setProgress(Math.round(eased * score));
      if (t < 1) requestAnimationFrame(tick);
    };

    const timer = setTimeout(() => requestAnimationFrame(tick), 400);
    return () => clearTimeout(timer);
  }, [score, animate]);

  const circumference = 2 * Math.PI * 52;
  const offset = circumference - (progress / 100) * circumference;

  const gradeColor = gradeColors[grade] || "text-white";

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <div className="relative flex items-center justify-center">
        {/* SVG circular progress */}
        <svg width="140" height="140" className="-rotate-90">
          {/* Track */}
          <circle cx="70" cy="70" r="52" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
          {/* Progress */}
          <motion.circle
            cx="70"
            cy="70"
            r="52"
            fill="none"
            stroke="url(#scoreGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.4 }}
          />
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2dd4bf" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>

        {/* Score text */}
        <div className="absolute flex flex-col items-center">
          <motion.span className="text-4xl font-display font-black text-white tabular-nums">
            {displayed}
          </motion.span>
          <span className="text-xs text-slate-500 font-medium">/ 100</span>
        </div>
      </div>

      {/* Grade badge */}
      <div
        className={cn(
          "flex items-center justify-center rounded-2xl border px-6 py-2",
          "border-white/10 bg-white/[0.04]"
        )}
      >
        <span className={cn("text-3xl font-display font-black", gradeColor)}>{grade}</span>
      </div>
    </div>
  );
}
