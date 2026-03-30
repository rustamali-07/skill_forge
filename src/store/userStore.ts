import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserProfile } from "@/types";

interface UserState {
  profile: UserProfile | null;
  isLoading: boolean;
  setProfile: (profile: UserProfile) => void;
  setLoading: (loading: boolean) => void;
  updateStats: (score: number) => void;
  clearProfile: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      profile: null,
      isLoading: false,

      setProfile: (profile) => set({ profile }),
      setLoading: (isLoading) => set({ isLoading }),

      updateStats: (score) => {
        const { profile } = get();
        if (!profile) return;
        const total = profile.totalInterviews + 1;
        const avg = (profile.averageScore * profile.totalInterviews + score) / total;
        set({
          profile: {
            ...profile,
            totalInterviews: total,
            averageScore: Math.round(avg),
          },
        });
      },

      clearProfile: () => set({ profile: null }),
    }),
    {
      name: "user-store",
    }
  )
);
