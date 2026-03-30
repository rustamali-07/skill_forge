"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { InterviewSession } from "@/types";
import { DifficultyBadge } from "@/components/shared/DifficultyBadge";
import { ChevronRight, Clock, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface RecentSessionsProps {
  sessions: InterviewSession[];
}

function gradeColor(grade: string) {
  if (grade?.startsWith("A")) return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
  if (grade?.startsWith("B")) return "text-teal-400 bg-teal-500/10 border-teal-500/30";
  if (grade === "C") return "text-amber-400 bg-amber-500/10 border-amber-500/30";
  return "text-rose-400 bg-rose-500/10 border-rose-500/30";
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

export function RecentSessions({ sessions }: RecentSessionsProps) {
  if (!sessions.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.02] p-12 text-center">
        <MessageSquare className="h-8 w-8 text-slate-700 mb-3" />
        <p className="text-sm font-medium text-slate-500">No interviews yet</p>
        <p className="text-xs text-slate-600 mt-1">Start your first mock interview to see results here</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {sessions.map((session, i) => (
        <motion.div
          key={session.id}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.06 }}
        >
          <Link href={`/feedback/${session.id}`}>
            <div className="group flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 hover:bg-white/[0.05] hover:border-white/10 transition-all">
              <div className="flex items-center gap-4 min-w-0">
                {/* Score circle */}
                <div className="flex-shrink-0 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500/10 to-violet-500/10 border border-white/[0.06]">
                  <span className="text-sm font-black text-white tabular-nums">
                    {session.score?.totalScore ?? "—"}
                  </span>
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{session.role}</p>
                  <div className="mt-0.5 flex items-center gap-2 flex-wrap">
                    <DifficultyBadge difficulty={session.difficulty} />
                    <span className="text-xs text-slate-600">
                      {formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })}
                    </span>
                    {session.duration > 0 && (
                      <span className="flex items-center gap-1 text-xs text-slate-600">
                        <Clock className="h-2.5 w-2.5" />
                        {formatDuration(session.duration)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                {session.score?.grade && (
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-bold",
                      gradeColor(session.score.grade)
                    )}
                  >
                    {session.score.grade}
                  </span>
                )}
                <ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
