import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ sessionId: string }> }
) {
    try {
        const { sessionId } = await params;

        const { data, error } = await supabase
            .from("interviews")
            .select("*")
            .eq("id", sessionId)
            .single();

        if (error) throw error;
        if (!data) {
            return NextResponse.json({ error: "Session not found" }, { status: 404 });
        }

        // Map snake_case to camelCase
        const session = {
            id: data.id,
            userId: data.user_id,
            role: data.role,
            difficulty: data.difficulty,
            type: data.type,
            questionCount: data.question_count,
            transcript: data.transcript || [],
            score: data.score || null,
            duration: data.duration || 0,
            createdAt: new Date(data.created_at).getTime(),
            status: data.status,
        };

        return NextResponse.json({ session });
    } catch (error: unknown) {
        console.error("Get interview error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to get interview" },
            { status: 500 }
        );
    }
}
