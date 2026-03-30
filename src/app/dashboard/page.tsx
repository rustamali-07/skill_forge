"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { InterviewSession } from "@/types";
import { Navbar } from "@/components/shared/Navbar";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentSessions } from "@/components/dashboard/RecentSessions";
import { SkillRadar } from "@/components/dashboard/SkillRadar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  Trophy,
  Target,
  Clock,
  TrendingUp,
  Play,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchSessions = async () => {
      try {
        const res = await fetch(
          `/api/interview/list?userId=${user.id}&status=completed&limit=20`
        );
        const data = await res.json();
        setSessions(data.sessions || []);
      } catch (err) {
        console.error("Failed to fetch sessions:", err);
        setSessions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, [user]);

  const totalInterviews = sessions.length;
  const avgScore =
    sessions.length > 0
      ? Math.round(
        sessions.reduce((sum, s) => sum + (s.score?.totalScore ?? 0), 0) / sessions.length
      )
      : 0;
  const totalTime = sessions.reduce((sum, s) => sum + (s.duration ?? 0), 0);
  const bestScore = sessions.length > 0 ? Math.max(...sessions.map((s) => s.score?.totalScore ?? 0)) : 0;

  const chartData = sessions
    .slice()
    .reverse()
    .slice(-8)
    .map((s) => ({
      date: format(new Date(s.createdAt), "MMM d"),
      score: s.score?.totalScore ?? 0,
    }));

  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0f1e]">
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 pt-24 pb-16 space-y-6">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl bg-white/[0.04]" />
            ))}
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            <Skeleton className="h-64 rounded-xl bg-white/[0.04] lg:col-span-2" />
            <Skeleton className="h-64 rounded-xl bg-white/[0.04]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e]">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="font-display text-3xl font-black text-white">
              Welcome back, {user?.firstName || "there"} 👋
            </h1>
            <p className="mt-1 text-slate-400">
              {totalInterviews > 0
                ? `You've completed ${totalInterviews} interview${totalInterviews !== 1 ? "s" : ""}. Keep it up!`
                : "Ready to start your first mock interview?"}
            </p>
          </div>
          <Link href="/interview/setup">
            <Button className="bg-white text-[#0a0f1e] hover:bg-white/90 border-0 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-shadow font-bold">
              <Play className="h-4 w-4 mr-2" />
              New Interview
            </Button>
          </Link>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 mb-6">
          <StatsCard label="Total Interviews" value={totalInterviews} icon={Target} index={0} />
          <StatsCard label="Average Score" value={avgScore || "—"} icon={TrendingUp} index={1} />
          <StatsCard label="Best Score" value={bestScore || "—"} icon={Trophy} index={2} />
          <StatsCard
            label="Time Practiced"
            value={
              totalTime > 3600
                ? `${Math.floor(totalTime / 3600)}h ${Math.floor((totalTime % 3600) / 60)}m`
                : totalTime > 60
                  ? `${Math.floor(totalTime / 60)}m`
                  : `${totalTime}s`
            }
            icon={Clock}
            index={3}
          />
        </div>

        {/* Charts row */}
        <div className="grid gap-4 lg:grid-cols-3 mb-6">
          {/* Score trend */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-5"
          >
            <h2 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">
              Score Trend
            </h2>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData} barSize={18}>
                  <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    domain={[0, 100]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "8px",
                      color: "#e2e8f0",
                      fontSize: "12px",
                    }}
                    cursor={{ fill: "rgba(255,255,255,0.02)" }}
                  />
                  <Bar
                    dataKey="score"
                    fill="url(#barGradient)"
                    radius={[4, 4, 0, 0]}
                  />
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2dd4bf" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-48 text-slate-600 text-sm">
                Complete interviews to see your progress
              </div>
            )}
          </motion.div>

          {/* Skill radar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5"
          >
            <h2 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">
              Skill Breakdown
            </h2>
            <SkillRadar sessions={sessions} />
          </motion.div>
        </div>

        {/* Recent sessions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Recent Interviews
            </h2>
            {sessions.length > 5 && (
              <Link href="/history">
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white text-xs">
                  View all <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            )}
          </div>
          <RecentSessions sessions={sessions.slice(0, 5)} />
        </motion.div>

        {/* Empty state CTA */}
        {totalInterviews === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.01] py-16 px-8 text-center"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500/20 to-violet-500/20 border border-white/[0.08] mb-4">
              <Play className="h-6 w-6 text-teal-400" />
            </div>
            <h3 className="font-display text-xl font-bold text-white">Start your first interview</h3>
            <p className="mt-2 text-sm text-slate-400 max-w-sm">
              Practice with our AI interviewer and get detailed feedback to improve your chances.
            </p>
            <Link href="/interview/setup" className="mt-6">
              <Button className="bg-white text-[#0a0f1e] hover:bg-white/90 border-0 shadow-[0_0_20px_rgba(255,255,255,0.3)] font-bold">
                Start Now <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
