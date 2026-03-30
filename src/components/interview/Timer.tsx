"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

interface TimerProps {
  startTime: number | null;
  className?: string;
}

export function Timer({ startTime, className }: TimerProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!startTime) return;
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const hours = Math.floor(elapsed / 3600);
  const minutes = Math.floor((elapsed % 3600) / 60);
  const seconds = elapsed % 60;

  const format = (n: number) => n.toString().padStart(2, "0");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex items-center gap-2 ${className || ""}`}
    >
      <Clock className="h-3.5 w-3.5 text-slate-500" />
      <span className="font-mono text-sm text-slate-400">
        {hours > 0 ? `${format(hours)}:` : ""}
        {format(minutes)}:{format(seconds)}
      </span>
    </motion.div>
  );
}
