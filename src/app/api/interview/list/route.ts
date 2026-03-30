import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");
        const status = searchParams.get("status");
        const limitParam = searchParams.get("limit");

        if (!userId) {
            return NextResponse.json({ error: "userId required" }, { status: 400 });
        }

        let query = supabase
            .from("interviews")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false });

        if (status) {
            query = query.eq("status", status);
        }

        if (limitParam) {
            query = query.limit(parseInt(limitParam, 10));
        }

        const { data, error } = await query;

        if (error) throw error;

        // Map snake_case DB columns to camelCase for frontend
        const sessions = (data || []).map((row) => ({
            id: row.id,
            userId: row.user_id,
            role: row.role,
            difficulty: row.difficulty,
            type: row.type,
            questionCount: row.question_count,
            transcript: row.transcript || [],
            score: row.score || null,
            duration: row.duration || 0,
            createdAt: new Date(row.created_at).getTime(),
            status: row.status,
        }));

        return NextResponse.json({ sessions });
    } catch (error: unknown) {
        console.error("List interviews error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to list interviews" },
            { status: 500 }
        );
    }
}
