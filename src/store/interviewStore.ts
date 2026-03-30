import { create } from "zustand";
import { persist } from "zustand/middleware";
import { InterviewSetup, TranscriptEntry, ScoreResult, InterviewStatus } from "@/types";

interface InterviewState {
  // Setup
  setup: InterviewSetup | null;
  sessionId: string | null;

  // Status
  status: InterviewStatus;
  questionIndex: number;
  startTime: number | null;
  duration: number;

  // Transcript
  transcript: TranscriptEntry[];

  // Score
  score: ScoreResult | null;
  isScoring: boolean;

  // Connection
  isConnected: boolean;
  isSpeaking: boolean; // AI is speaking
  isListening: boolean; // User mic is active
  audioLevel: number; // 0-1 mic audio level

  // Actions
  setSetup: (setup: InterviewSetup) => void;
  setSessionId: (id: string) => void;
  setStatus: (status: InterviewStatus) => void;
  setConnected: (connected: boolean) => void;
  setSpeaking: (speaking: boolean) => void;
  setListening: (listening: boolean) => void;
  setAudioLevel: (level: number) => void;
  incrementQuestion: () => void;
  addTranscriptEntry: (entry: TranscriptEntry) => void;
  setScore: (score: ScoreResult) => void;
  setIsScoring: (isScoring: boolean) => void;
  startInterview: () => void;
  endInterview: () => void;
  reset: () => void;
}

const initialState = {
  setup: null,
  sessionId: null,
  status: "idle" as InterviewStatus,
  questionIndex: 0,
  startTime: null,
  duration: 0,
  transcript: [],
  score: null,
  isScoring: false,
  isConnected: false,
  isSpeaking: false,
  isListening: false,
  audioLevel: 0,
};

export const useInterviewStore = create<InterviewState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setSetup: (setup) => set({ setup }),
      setSessionId: (sessionId) => set({ sessionId }),
      setStatus: (status) => set({ status }),
      setConnected: (isConnected) => set({ isConnected }),
      setSpeaking: (isSpeaking) => set({ isSpeaking }),
      setListening: (isListening) => set({ isListening }),
      setAudioLevel: (audioLevel) => set({ audioLevel }),

      incrementQuestion: () =>
        set((state) => ({ questionIndex: state.questionIndex + 1 })),

      addTranscriptEntry: (entry) =>
        set((state) => ({ transcript: [...state.transcript, entry] })),

      setScore: (score) => set({ score }),
      setIsScoring: (isScoring) => set({ isScoring }),

      startInterview: () =>
        set({
          status: "in-progress",
          startTime: Date.now(),
          questionIndex: 0,
          transcript: [],
          score: null,
          isScoring: false,
        }),

      endInterview: () => {
        const { startTime } = get();
        const duration = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
        set({ status: "completed", duration });
      },

      reset: () => set(initialState),
    }),
    {
      name: "interview-store",
      partialize: (state) => ({
        setup: state.setup,
        sessionId: state.sessionId,
        score: state.score,
        transcript: state.transcript,
        duration: state.duration,
        status: state.status,
      }),
    }
  )
);
