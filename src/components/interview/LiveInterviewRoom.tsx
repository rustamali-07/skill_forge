"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useInterviewStore } from "@/store/interviewStore";
import { useInterviewAI } from "@/hooks/useInterviewAI";
import { useInterviewSession } from "@/hooks/useInterviewSession";
import { AIAvatar } from "./AIAvatar";
import { TranscriptPanel } from "./TranscriptPanel";
import { Timer } from "./Timer";
import { Button } from "@/components/ui/button";
import { DifficultyBadge } from "@/components/shared/DifficultyBadge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Mic,
  MicOff,
  PhoneOff,
  ChevronRight,
  Loader2,
  AlertTriangle,
  Video,
  VideoOff,
  Download,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface LiveInterviewRoomProps {
  sessionId: string;
}

export function LiveInterviewRoom({ sessionId }: LiveInterviewRoomProps) {
  const router = useRouter();
  const { user } = useUser();
  const store = useInterviewStore();
  const { finalizeSession, abandonSession } = useInterviewSession();

  const setup = store.setup;
  const { connect, disconnect, isProcessing, isListening, toggleMute } =
    useInterviewAI(setup);

  const [isConnecting, setIsConnecting] = useState(true);
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [connectError, setConnectError] = useState<string | null>(null);
  const [showTranscript, setShowTranscript] = useState(true);

  // Webcam & recording
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const [isWebcamOn, setIsWebcamOn] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);

  const startWebcam = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720, facingMode: "user" },
        audio: false,
      });
      streamRef.current = stream;
      setIsWebcamOn(true);

      const recorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
          ? "video/webm;codecs=vp9"
          : "video/webm",
      });
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        setRecordedUrl(URL.createObjectURL(blob));
      };
      mediaRecorderRef.current = recorder;
      recorder.start(1000);
      setIsRecording(true);
    } catch (err) {
      console.error("Webcam error:", err);
      toast.error("Could not access camera.");
    }
  }, []);

  // Attach stream to video element when webcam turns on
  useEffect(() => {
    if (isWebcamOn && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [isWebcamOn]);

  const stopWebcam = useCallback(() => {
    if (mediaRecorderRef.current?.state !== "inactive") {
      mediaRecorderRef.current?.stop();
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    setIsWebcamOn(false);
    setIsRecording(false);
  }, []);

  const downloadRecording = useCallback(() => {
    if (!recordedUrl) return;
    const a = document.createElement("a");
    a.href = recordedUrl;
    a.download = `skillforge-interview-${sessionId}.webm`;
    a.click();
    toast.success("Recording downloaded!");
  }, [recordedUrl, sessionId]);

  useEffect(() => {
    const init = async () => {
      try {
        setIsConnecting(true);
        setConnectError(null);
        await startWebcam();
        await connect();
        setIsConnecting(false);
      } catch (err: unknown) {
        setIsConnecting(false);
        const message = err instanceof Error ? err.message : "Failed to connect";
        setConnectError(message);
        toast.error(message);
      }
    };
    init();
    return () => {
      disconnect();
      stopWebcam();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEndInterview = useCallback(async () => {
    setShowEndDialog(false);
    disconnect();
    stopWebcam();
    await finalizeSession(sessionId);
  }, [disconnect, stopWebcam, finalizeSession, sessionId]);

  const handleAbandon = useCallback(async () => {
    setShowEndDialog(false);
    disconnect();
    stopWebcam();
    await abandonSession(sessionId);
  }, [disconnect, stopWebcam, abandonSession, sessionId]);

  if (!setup) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a0f1e]">
        <div className="text-center">
          <p className="text-slate-400">No interview setup found.</p>
          <Button className="mt-4" onClick={() => router.push("/interview/setup")}>
            Start New Interview
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#0a0f1e] overflow-hidden">
      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar — minimal like Zoom */}
        <div className="flex items-center justify-between px-4 py-2 bg-[#0d1321]/80 border-b border-white/[0.04]">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-medium text-slate-400">
                {setup.role}
              </span>
            </div>
            <DifficultyBadge difficulty={setup.difficulty} />
            <span className="text-[11px] text-slate-500">{setup.type}</span>
          </div>
          <div className="flex items-center gap-3">
            <Timer startTime={store.startTime} />
            {recordedUrl && (
              <button
                onClick={downloadRecording}
                className="text-teal-400 hover:text-teal-300 text-xs flex items-center gap-1"
              >
                <Download className="h-3.5 w-3.5" />
                Save
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center gap-4 p-4 overflow-hidden relative">
          {/* Loading overlay */}
          <AnimatePresence>
            {isConnecting && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0f1e]/90 z-10"
              >
                <Loader2 className="h-8 w-8 animate-spin text-teal-400 mb-4" />
                <p className="text-sm text-slate-400">Connecting...</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error */}
          {connectError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
              <AlertTriangle className="h-8 w-8 text-amber-400 mb-3" />
              <p className="text-sm text-slate-400 mb-3">{connectError}</p>
              <Button
                size="sm"
                onClick={async () => {
                  setConnectError(null);
                  setIsConnecting(true);
                  try {
                    await connect();
                    setIsConnecting(false);
                  } catch (err: unknown) {
                    setIsConnecting(false);
                    setConnectError(
                      err instanceof Error ? err.message : "Failed to connect"
                    );
                  }
                }}
              >
                Retry
              </Button>
            </div>
          )}

          {/* Candidate tile (LEFT) */}
          <div className="relative rounded-xl overflow-hidden bg-[#111827] border border-white/[0.06]" style={{ width: '45%', maxWidth: 520, aspectRatio: '4/3' }}>
            {/* Always render video element so ref is available */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={cn(
                "w-full h-full object-cover",
                isWebcamOn ? "block" : "hidden"
              )}
              style={{ transform: "scaleX(-1)" }}
            />
            {!isWebcamOn && (
              <div className="w-full h-full flex items-center justify-center bg-[#111827]">
                <div className="h-24 w-24 rounded-full bg-white/[0.06] flex items-center justify-center">
                  <span className="text-3xl font-bold text-slate-500">
                    {user?.firstName?.[0] || "Y"}
                  </span>
                </div>
              </div>
            )}
            {/* Name tag */}
            <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5">
              <span className="text-xs font-medium text-white">
                {user?.firstName || "You"}
              </span>
              {isListening && !store.isSpeaking && (
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </div>
            {/* REC badge */}
            {isRecording && (
              <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1">
                <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                <span className="text-[10px] text-rose-400 font-semibold tracking-wider">
                  REC
                </span>
              </div>
            )}
          </div>

          {/* AI tile (RIGHT) */}
          <div className="relative rounded-xl overflow-hidden bg-[#111827] border border-white/[0.06] flex items-center justify-center" style={{ width: '45%', maxWidth: 520, aspectRatio: '4/3' }}>
            <div className="flex flex-col items-center gap-4">
              <AIAvatar
                isSpeaking={store.isSpeaking}
                isConnected={store.isConnected}
                className="h-44 w-44"
              />
              {/* Status */}
              {store.isSpeaking && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2"
                >
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1 bg-violet-400 rounded-full"
                        animate={{ height: [4, 20, 4] }}
                        transition={{
                          repeat: Infinity,
                          duration: 0.7,
                          delay: i * 0.12,
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
            {/* Name tag */}
            <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5">
              <span className="text-xs font-medium text-white">
                Alex (AI Interviewer)
              </span>
              {store.isSpeaking && (
                <div className="flex gap-0.5">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-0.5 bg-teal-400 rounded-full"
                      animate={{ height: [2, 8, 2] }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.6,
                        delay: i * 0.1,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom control bar — Zoom-style */}
        <div className="flex items-center justify-center gap-4 px-4 py-3 bg-[#0d1321]/80 border-t border-white/[0.04]">
          {/* Mic */}
          <button
            onClick={toggleMute}
            disabled={isProcessing || store.isSpeaking}
            className={cn(
              "flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all",
              !isListening
                ? "bg-rose-500/20 text-rose-400"
                : "hover:bg-white/[0.06] text-white"
            )}
          >
            {!isListening ? (
              <MicOff className="h-5 w-5" />
            ) : (
              <Mic className="h-5 w-5" />
            )}
            <span className="text-[10px]">{isListening ? "Mute" : "Unmute"}</span>
          </button>

          {/* Camera */}
          <button
            onClick={() => (isWebcamOn ? stopWebcam() : startWebcam())}
            className={cn(
              "flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all",
              !isWebcamOn
                ? "bg-rose-500/20 text-rose-400"
                : "hover:bg-white/[0.06] text-white"
            )}
          >
            {isWebcamOn ? (
              <Video className="h-5 w-5" />
            ) : (
              <VideoOff className="h-5 w-5" />
            )}
            <span className="text-[10px]">
              {isWebcamOn ? "Stop Video" : "Start Video"}
            </span>
          </button>

          {/* Transcript toggle */}
          <button
            onClick={() => setShowTranscript((p) => !p)}
            className={cn(
              "flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all",
              showTranscript
                ? "bg-teal-500/20 text-teal-400"
                : "hover:bg-white/[0.06] text-white"
            )}
          >
            <MessageSquare className="h-5 w-5" />
            <span className="text-[10px]">Transcript</span>
          </button>

          {/* End call */}
          <button
            onClick={() => setShowEndDialog(true)}
            className="flex flex-col items-center gap-1 px-6 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition-all"
          >
            <PhoneOff className="h-5 w-5" />
            <span className="text-[10px]">End</span>
          </button>
        </div>

        {/* Scoring overlay */}
        <AnimatePresence>
          {store.isScoring && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0f1e]/95 z-20"
            >
              <div className="text-center space-y-4">
                <div className="relative flex items-center justify-center">
                  <motion.div
                    className="h-16 w-16 rounded-full border-2 border-teal-500/20"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                  <div className="absolute">
                    <Loader2 className="h-6 w-6 text-teal-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Analyzing your performance...
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">
                    Our AI is reviewing your interview responses
                  </p>
                </div>
                {recordedUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white/10 text-slate-400"
                    onClick={downloadRecording}
                  >
                    <Download className="h-3.5 w-3.5 mr-1.5" />
                    Download Recording
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Transcript sidebar — toggleable */}
      {showTranscript && (
        <div className="hidden lg:flex w-80 flex-col border-l border-white/[0.06] bg-[#0d1321] overflow-hidden">
          <TranscriptPanel
            transcript={store.transcript}
            className="flex-1 min-h-0"
          />
        </div>
      )}

      {/* End dialog */}
      <Dialog open={showEndDialog} onOpenChange={setShowEndDialog}>
        <DialogContent className="bg-[#111827] border-white/10 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle>End Interview?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-400">
            Your responses will be scored and feedback will be generated.
          </p>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={handleAbandon}
              className="border-white/10 text-slate-400 hover:text-white"
            >
              Abandon
            </Button>
            <Button
              onClick={handleEndInterview}
              className="bg-gradient-to-r from-teal-500 to-violet-500 text-white border-0"
            >
              <ChevronRight className="h-4 w-4 mr-1" />
              Get Feedback
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
