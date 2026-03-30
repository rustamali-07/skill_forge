"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import Vapi from "@vapi-ai/web";
import { InterviewSetup } from "@/types";
import { buildInterviewPrompt } from "@/lib/prompts";
import { useInterviewStore } from "@/store/interviewStore";

let vapiInstance: Vapi | null = null;
let listenersSetUp = false;

export function useInterviewAI(setup: InterviewSetup | null) {
    const store = useInterviewStore();
    const [isProcessing, setIsProcessing] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [callId, setCallId] = useState<string | null>(null);
    const isConnectedRef = useRef(false);
    const storeRef = useRef(store);
    storeRef.current = store;

    const setupListeners = useCallback(() => {
        if (!vapiInstance || listenersSetUp) return;
        listenersSetUp = true;

        vapiInstance.on("call-start", () => {
            isConnectedRef.current = true;
            storeRef.current.setConnected(true);
            storeRef.current.setStatus("in-progress");
            setIsListening(true);
            setIsProcessing(false);
        });

        vapiInstance.on("speech-start", () => {
            storeRef.current.setSpeaking(true);
            setIsListening(false);
        });

        vapiInstance.on("speech-end", () => {
            storeRef.current.setSpeaking(false);
            setIsListening(true);
        });

        vapiInstance.on("message", (message) => {
            if (message.type === "transcript" && message.transcriptType === "final") {
                storeRef.current.addTranscriptEntry({
                    speaker: message.role === "assistant" ? "ai" : "user",
                    text: message.transcript,
                    timestamp: Date.now(),
                });
            }
        });

        vapiInstance.on("call-end", () => {
            isConnectedRef.current = false;
            storeRef.current.setConnected(false);
            storeRef.current.setSpeaking(false);
            setIsListening(false);
        });

        vapiInstance.on("error", (error) => {
            console.error("Vapi error:", error);
        });
    }, []);

    useEffect(() => {
        const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
        if (publicKey && !vapiInstance) {
            vapiInstance = new Vapi(publicKey);
        }
        return () => {
            if (vapiInstance && isConnectedRef.current) {
                vapiInstance.stop();
            }
        };
    }, []);

    const connect = useCallback(async () => {
        if (!setup) throw new Error("No interview setup");

        const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
        const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;

        if (!publicKey) throw new Error("Vapi API key not configured.");

        if (!vapiInstance) {
            vapiInstance = new Vapi(publicKey);
        }

        const systemPrompt = buildInterviewPrompt(setup);
        setupListeners();

        try {
            setIsProcessing(true);

            let call;
            if (assistantId) {
                call = await vapiInstance.start(assistantId, {
                    firstMessage: `Hello! I'm Alex, your AI interviewer today. Welcome to your ${setup.type.toLowerCase()} interview for the ${setup.role} position. I'll be asking you ${setup.questionCount} questions. Let's get started!`,
                    model: {
                        provider: "openai" as const,
                        model: "gpt-4.1",
                        messages: [{ role: "system" as const, content: systemPrompt }],
                    },
                });
            } else {
                call = await vapiInstance.start({
                    name: `SkillForge - ${setup.role}`,
                    firstMessage: `Hello! I'm Alex, your AI interviewer. Let's begin your ${setup.type.toLowerCase()} interview for ${setup.role}.`,
                    model: {
                        provider: "openai" as const,
                        model: "gpt-4o-mini",
                        messages: [{ role: "system" as const, content: systemPrompt }],
                        temperature: 0.7,
                    },
                    voice: { provider: "11labs" as const, voiceId: "chris" },
                });
            }

            // Capture callId for Vapi analysis fetch
            if (call?.id) {
                setCallId(call.id);
                console.log("[vapi] Call started, id:", call.id);
            }
        } catch (err) {
            setIsProcessing(false);
            throw new Error(err instanceof Error ? err.message : "Failed to start interview");
        }
    }, [setup, setupListeners]);

    const disconnect = useCallback(() => {
        if (vapiInstance) {
            vapiInstance.stop();
            vapiInstance.removeAllListeners();
            listenersSetUp = false;
        }
        isConnectedRef.current = false;
        setIsListening(false);
        setIsProcessing(false);
        storeRef.current.setConnected(false);
        storeRef.current.setSpeaking(false);
    }, []);

    const toggleMute = useCallback(() => {
        if (!vapiInstance) return;
        if (isListening) {
            vapiInstance.setMuted(true);
            setIsListening(false);
        } else {
            vapiInstance.setMuted(false);
            setIsListening(true);
        }
    }, [isListening]);

    return { connect, disconnect, isProcessing, isListening, toggleMute, callId };
}
