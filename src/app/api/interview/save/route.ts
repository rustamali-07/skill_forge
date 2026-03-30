import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, action, data } = body;

    if (!sessionId) {
      return NextResponse.json({ error: "sessionId required" }, { status: 400 });
    }

    if (action === "create") {
      const { error } = await supabase.from("interviews").insert({
        id: sessionId,
        user_id: data.userId,
        role: data.role,
        difficulty: data.difficulty,
        type: data.type,
        question_count: data.questionCount,
        transcript: [],
        duration: 0,
        status: "in-progress",
      });

      if (error) throw error;
    } else if (action === "update") {
      const updateData: Record<string, unknown> = {};
      if (data.status) updateData.status = data.status;
      if (data.transcript) updateData.transcript = data.transcript;
      if (data.duration !== undefined) updateData.duration = data.duration;

      const { error } = await supabase
        .from("interviews")
        .update(updateData)
        .eq("id", sessionId);

      if (error) throw error;
    } else if (action === "complete") {
      const { error } = await supabase
        .from("interviews")
        .update({
          transcript: data.transcript,
          score: data.score,
          duration: data.duration,
          status: "completed",
          completed_at: new Date().toISOString(),
        })
        .eq("id", sessionId);

      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Save interview error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to save interview" },
      { status: 500 }
    );
  }
}
