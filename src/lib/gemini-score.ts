import { ScoreResult, InterviewSetup } from "@/types";
import { buildScoringPrompt } from "./prompts";

export async function scoreInterview(
  transcript: Array<{ speaker: string; text: string }>,
  setup: InterviewSetup
): Promise<ScoreResult> {
  const response = await fetch("/api/gemini/score", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ transcript, setup }),
  });

  if (!response.ok) {
    throw new Error("Failed to score interview");
  }

  const data = await response.json();
  return data.result as ScoreResult;
}

export { buildScoringPrompt };
