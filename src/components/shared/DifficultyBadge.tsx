"use client";

import { cn } from "@/lib/utils";
import { Difficulty } from "@/types";

const config: Record<Difficulty, { label: string; className: string }> = {
  Beginner: {
    label: "Beginner",
    className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  },
  Intermediate: {
    label: "Intermediate",
    className: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  },
  Advanced: {
    label: "Advanced",
    className: "bg-rose-500/15 text-rose-400 border-rose-500/30",
  },
};

interface DifficultyBadgeProps {
  difficulty: Difficulty;
  className?: string;
}

export function DifficultyBadge({ difficulty, className }: DifficultyBadgeProps) {
  const { label, className: badgeClass } = config[difficulty];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        badgeClass,
        className
      )}
    >
      {label}
    </span>
  );
}
