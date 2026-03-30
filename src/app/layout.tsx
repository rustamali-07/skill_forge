import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "SkillForge — AI-Powered Mock Interviews",
  description:
    "Practice job interviews with AI. Get real-time voice interviews, live transcription, and detailed scoring feedback tailored to your target role.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body
          className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased bg-[#0a0f1e] text-white`}
        >
          {children}
          <Toaster
            theme="dark"
            toastOptions={{
              classNames: {
                toast: "bg-slate-900 border-white/10 text-white",
                description: "text-slate-400",
              },
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  );
}
