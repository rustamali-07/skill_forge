"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { ScoreResult } from "@/types";

interface SkillRadarProps {
  sessions: { score?: ScoreResult }[];
}

export function SkillRadar({ sessions }: SkillRadarProps) {
  const completedSessions = sessions.filter((s) => s.score);

  if (!completedSessions.length) {
    return (
      <div className="flex items-center justify-center h-52 text-slate-600 text-sm">
        Complete interviews to see your skill radar
      </div>
    );
  }

  const avg = (key: keyof ScoreResult["categories"]) => {
    const scores = completedSessions.map((s) => s.score!.categories[key].score);
    const maxVals = completedSessions.map((s) => s.score!.categories[key].max);
    const totalScore = scores.reduce((a, b) => a + b, 0);
    const totalMax = maxVals.reduce((a, b) => a + b, 0);
    return Math.round((totalScore / totalMax) * 100);
  };

  const data = [
    { subject: "Communication", value: avg("communication"), fullMark: 100 },
    { subject: "Technical", value: avg("technical"), fullMark: 100 },
    { subject: "Problem Solving", value: avg("problemSolving"), fullMark: 100 },
    { subject: "Confidence", value: avg("confidence"), fullMark: 100 },
    { subject: "Structure", value: avg("structure"), fullMark: 100 },
  ];

  return (
    <ResponsiveContainer width="100%" height={220}>
      <RadarChart data={data}>
        <PolarGrid stroke="rgba(255,255,255,0.06)" />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fill: "#64748b", fontSize: 11, fontFamily: "inherit" }}
        />
        <Radar
          name="Skills"
          dataKey="value"
          stroke="#2dd4bf"
          fill="#2dd4bf"
          fillOpacity={0.15}
          strokeWidth={2}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#0f172a",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "8px",
            color: "#e2e8f0",
            fontSize: "12px",
          }}
          formatter={(value) => [`${value}%`, "Score"]}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
