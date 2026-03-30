import { NextRequest, NextResponse } from "next/server";
import { buildScoringPrompt } from "@/lib/prompts";
import { InterviewSetup, TranscriptEntry } from "@/types";

function extractJSON(content: string): unknown {
  // Strategy 1: direct parse
  try {
    return JSON.parse(content.trim());
  } catch { }

  // Strategy 2: strip markdown fences then parse
  const stripped = content
    .replace(/^```json\s*/im, "")
    .replace(/^```\s*/im, "")
    .replace(/```\s*$/im, "")
    .trim();
  try {
    return JSON.parse(stripped);
  } catch { }

  // Strategy 3: find the JSON object by scanning for balanced braces
  let depth = 0;
  let start = -1;
  for (let i = 0; i < content.length; i++) {
    if (content[i] === "{") {
      if (depth === 0) start = i;
      depth++;
    } else if (content[i] === "}") {
      depth--;
      if (depth === 0 && start !== -1) {
        try {
          return JSON.parse(content.slice(start, i + 1));
        } catch {
          // keep scanning
          start = -1;
        }
      }
    }
  }

  throw new Error(
    `Could not extract valid JSON from response. First 300 chars: ${content.slice(0, 300)}`
  );
}

export async function POST(request: NextRequest) {
  try {
    const { transcript, setup } = (await request.json()) as {
      transcript: TranscriptEntry[];
      setup: InterviewSetup;
    };

    if (!setup) {
      return NextResponse.json({ error: "setup is required" }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENROUTER_API_KEY not configured" },
        { status: 500 }
      );
    }

    const prompt = buildScoringPrompt(transcript ?? [], setup);

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "SkillForge",
      },
      body: JSON.stringify({
        model: "openrouter/auto",
        messages: [
          {
            role: "user",
            content:
              prompt +
              "\n\nRespond with ONLY a raw JSON object — no markdown, no explanation, no code fences.",
          },
        ],
        temperature: 0.3,
        max_tokens: 3000,
      }),
    });

    const raw = await res.text();
    console.log(`[score] OpenRouter HTTP ${res.status}, body[:200]: ${raw.slice(0, 200)}`);

    if (!res.ok) {
      throw new Error(`OpenRouter error ${res.status}: ${raw.slice(0, 300)}`);
    }

    const data = JSON.parse(raw);
    const content: string = data.choices?.[0]?.message?.content ?? "";

    if (!content) {
      throw new Error("OpenRouter returned empty content");
    }

    console.log(`[score] Content[:300]: ${content.slice(0, 300)}`);

    const scoreResult = extractJSON(content);

    console.log("[score] ✅ Scoring successful");
    return NextResponse.json({ result: scoreResult });
  } catch (error: unknown) {
    console.error("[score] Error:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to score interview",
      },
      { status: 500 }
    );
  }
}
