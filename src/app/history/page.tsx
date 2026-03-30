"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { InterviewSession, Difficulty } from "@/types";
import { Navbar } from "@/components/shared/Navbar";
import { DifficultyBadge } from "@/components/shared/DifficultyBadge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { format } from "date-fns";
import { Clock, ChevronRight, Play, Filter, Search } from "lucide-react";
import { cn } from "@/lib/utils";

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

function gradeColor(grade?: string) {
  if (!grade) return "text-slate-500 bg-white/[0.04] border-white/[0.06]";
  if (grade.startsWith("A")) return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
  if (grade.startsWith("B")) return "text-teal-400 bg-teal-500/10 border-teal-500/30";
  if (grade === "C") return "text-amber-400 bg-amber-500/10 border-amber-500/30";
  return "text-rose-400 bg-rose-500/10 border-rose-500/30";
}

export default function HistoryPage() {
  const { user } = useUser();
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState<Difficulty | "All">("All");

  useEffect(() => {
    if (!user) return;
    const fetchSessions = async () => {
      try {
        const res = await fetch(`/api/interview/list?userId=${user.id}`);
        const data = await res.json();
        setSessions(data.sessions || []);
      } catch (err) {
        console.error("Failed to fetch history:", err);
        setSessions([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSessions();
  }, [user]);

  const filtered = sessions.filter((s) => {
    const matchSearch =
      !search || s.role.toLowerCase().includes(search.toLowerCase());
    const matchDiff = filterDifficulty === "All" || s.difficulty === filterDifficulty;
    return matchSearch && matchDiff;
  });

  return (
    <div className="min-h-screen bg-[#0a0f1e]">
      <Navbar />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="font-display text-3xl font-black text-white">Interview History</h1>
            <p className="mt-1 text-slate-400">
              {sessions.length > 0
                ? `${sessions.length} interview${sessions.length !== 1 ? "s" : ""} total`
                : "No interviews yet"}
            </p>
          </div>
          <Link href="/interview/setup">
            <Button className="bg-white text-[#0a0f1e] hover:bg-white/90 border-0 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-shadow font-bold">
              <Play className="h-4 w-4 mr-2" />
              New Interview
            </Button>
          </Link>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:border-teal-500/40 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-500" />
            {(["All", "Beginner", "Intermediate", "Advanced"] as const).map((d) => (
              <button
                key={d}
                onClick={() => setFilterDifficulty(d)}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-xs font-medium transition-all",
                  filterDifficulty === d
                    ? "border-teal-500/40 bg-teal-500/10 text-teal-300"
                    : "border-white/[0.08] bg-white/[0.02] text-slate-500 hover:text-slate-300"
                )}
              >
                {d}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Sessions list */}
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-xl bg-white/[0.04]" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.01] py-16 text-center">
            <p className="text-slate-500 text-sm mb-3">
              {sessions.length === 0 ? "No interviews yet" : "No matches found"}
            </p>
            {sessions.length === 0 && (
              <Link href="/interview/setup">
                <Button
                  size="sm"
                  className="bg-white text-[#0a0f1e] hover:bg-white/90 border-0 shadow-[0_0_20px_rgba(255,255,255,0.3)] font-bold"
                >
                  Start your first interview
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((session, i) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Link href={`/feedback/${session.id}`}>
                  <div className="group flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 hover:bg-white/[0.05] hover:border-white/10 transition-all">
                    {/* Left: score + info */}
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      {/* Score */}
                      <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500/10 to-violet-500/10 border border-white/[0.06]">
                        <span className="text-sm font-black text-white">
                          {session.score?.totalScore ?? "—"}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-white truncate">
                          {session.role}
                        </p>
                        <div className="mt-1 flex items-center gap-2 flex-wrap">
                          <DifficultyBadge difficulty={session.difficulty} />
                          <span className="text-xs text-slate-600 border border-white/[0.06] rounded-full px-2 py-0.5">
                            {session.type}
                          </span>
                          {session.duration > 0 && (
                            <span className="flex items-center gap-1 text-xs text-slate-600">
                              <Clock className="h-2.5 w-2.5" />
                              {formatDuration(session.duration)}
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-xs text-slate-600">
                          {format(new Date(session.createdAt), "MMM d, yyyy 'at' h:mm a")}
                        </p>
                      </div>
                    </div>

                    {/* Right: grade + arrow */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                      {session.score?.grade && (
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full border px-2.5 py-0.5 text-sm font-bold",
                            gradeColor(session.score.grade)
                          )}
                        >
                          {session.score.grade}
                        </span>
                      )}
                      <div
                        className={cn(
                          "rounded-full px-2 py-0.5 text-xs font-medium border",
                          session.status === "completed"
                            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                            : "border-white/[0.06] bg-white/[0.02] text-slate-600"
                        )}
                      >
                        {session.status}
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
