"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TranscriptEntry } from "@/types";
import { Brain, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface TranscriptPanelProps {
  transcript: TranscriptEntry[];
  className?: string;
}

export function TranscriptPanel({ transcript, className }: TranscriptPanelProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  return (
    <div className={cn("flex flex-col h-full overflow-hidden", className)}>
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
        <div className="h-2 w-2 rounded-full bg-teal-400 animate-pulse" />
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Live Transcript
        </span>
      </div>

      <ScrollArea className="flex-1 min-h-0 px-4 py-3">
        {transcript.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-slate-600 text-sm">
            Transcript will appear here...
          </div>
        ) : (
          <div className="space-y-4">
            {transcript.map((entry, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "flex gap-3",
                  entry.speaker === "user" ? "flex-row-reverse" : "flex-row"
                )}
              >
                {/* Avatar */}
                <div
                  className={cn(
                    "flex-shrink-0 h-7 w-7 rounded-full flex items-center justify-center",
                    entry.speaker === "ai"
                      ? "bg-gradient-to-br from-teal-500 to-violet-500"
                      : "bg-white/10"
                  )}
                >
                  {entry.speaker === "ai" ? (
                    <Brain className="h-3.5 w-3.5 text-white" />
                  ) : (
                    <User className="h-3.5 w-3.5 text-white" />
                  )}
                </div>

                {/* Bubble */}
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-3.5 py-2.5",
                    entry.speaker === "ai"
                      ? "bg-white/[0.06] rounded-tl-sm"
                      : "bg-teal-500/15 border border-teal-500/20 rounded-tr-sm"
                  )}
                >
                  <p className="font-mono text-xs leading-relaxed text-slate-200">
                    {entry.text}
                  </p>
                  <p className="mt-1 text-[10px] text-slate-600">
                    {format(new Date(entry.timestamp), "HH:mm:ss")}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </ScrollArea>
    </div>
  );
}
