"use client";

import { use } from "react";
import { LiveInterviewRoom } from "@/components/interview/LiveInterviewRoom";

interface InterviewPageProps {
  params: Promise<{ sessionId: string }>;
}

export default function InterviewPage({ params }: InterviewPageProps) {
  const { sessionId } = use(params);
  return <LiveInterviewRoom sessionId={sessionId} />;
}
