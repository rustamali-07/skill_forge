"use client";

import { motion } from "framer-motion";
import { Brain } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIAvatarProps {
  isSpeaking: boolean;
  isConnected: boolean;
  className?: string;
}

export function AIAvatar({ isSpeaking, isConnected, className }: AIAvatarProps) {
  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      {/* Outer pulsing rings when speaking */}
      {isSpeaking && (
        <>
          <motion.div
            className="absolute rounded-full border border-teal-500/30"
            initial={{ width: 80, height: 80, opacity: 0.8 }}
            animate={{ width: 160, height: 160, opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
          />
          <motion.div
            className="absolute rounded-full border border-violet-500/20"
            initial={{ width: 80, height: 80, opacity: 0.6 }}
            animate={{ width: 200, height: 200, opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 0.3 }}
          />
          <motion.div
            className="absolute rounded-full border border-teal-500/10"
            initial={{ width: 80, height: 80, opacity: 0.4 }}
            animate={{ width: 240, height: 240, opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 0.6 }}
          />
        </>
      )}

      {/* Static glow ring */}
      <div
        className={cn(
          "absolute rounded-full transition-all duration-500",
          isSpeaking
            ? "shadow-[0_0_60px_rgba(45,212,191,0.3),0_0_30px_rgba(139,92,246,0.2)]"
            : "shadow-[0_0_20px_rgba(45,212,191,0.1)]"
        )}
        style={{ width: 100, height: 100 }}
      />

      {/* Avatar circle */}
      <motion.div
        className={cn(
          "relative z-10 flex items-center justify-center rounded-full",
          "bg-gradient-to-br from-teal-500/20 to-violet-500/20",
          "border-2 transition-all duration-300",
          isSpeaking
            ? "border-teal-400/60 shadow-lg shadow-teal-500/20"
            : isConnected
            ? "border-white/20"
            : "border-white/10"
        )}
        style={{ width: 90, height: 90 }}
        animate={isSpeaking ? { scale: [1, 1.03, 1] } : { scale: 1 }}
        transition={{ duration: 0.8, repeat: isSpeaking ? Infinity : 0 }}
      >
        {/* Inner gradient circle */}
        <div className="flex items-center justify-center w-full h-full rounded-full bg-gradient-to-br from-slate-800 to-slate-900">
          <motion.div
            animate={
              isSpeaking
                ? {
                    scale: [1, 1.1, 0.95, 1.05, 1],
                  }
                : { scale: 1 }
            }
            transition={{
              duration: 0.6,
              repeat: isSpeaking ? Infinity : 0,
            }}
          >
            <Brain
              className={cn(
                "h-9 w-9 transition-colors duration-300",
                isSpeaking ? "text-teal-400" : isConnected ? "text-slate-400" : "text-slate-600"
              )}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Speaking indicator */}
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
        <div
          className={cn(
            "flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium transition-all duration-300",
            isSpeaking
              ? "border-teal-500/40 bg-teal-500/10 text-teal-400"
              : isConnected
              ? "border-white/10 bg-white/5 text-slate-500"
              : "border-white/5 bg-white/[0.02] text-slate-600"
          )}
        >
          {isSpeaking ? (
            <>
              <motion.span
                className="h-1.5 w-1.5 rounded-full bg-teal-400"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
              Speaking
            </>
          ) : isConnected ? (
            <>
              <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
              Listening
            </>
          ) : (
            <>
              <span className="h-1.5 w-1.5 rounded-full bg-slate-600" />
              Connecting...
            </>
          )}
        </div>
      </div>
    </div>
  );
}
