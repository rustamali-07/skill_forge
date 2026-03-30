"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Mic,
  BarChart3,
  ArrowRight,
  Zap,
  Target,
  Trophy,
  Star,
  ChevronDown,
  CheckCircle2,
  Sparkles,
  MessageSquare,
  BookOpen,
  Users,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

const features = [
  {
    icon: Mic,
    title: "Real-Time Voice Interviews",
    desc: "Speak naturally with our AI interviewer powered by Gemini Multimodal Live API — just like a real interview.",
    tag: "core",
    span: "col-span-1 sm:col-span-2",
  },
  {
    icon: MessageSquare,
    title: "Live Transcription",
    desc: "Every word transcribed in real-time. Review your answers as the conversation unfolds.",
    tag: "core",
    span: "col-span-1",
  },
  {
    icon: BarChart3,
    title: "Detailed Scoring",
    desc: "Get scored across 5 key dimensions with per-answer feedback and model answers.",
    tag: "core",
    span: "col-span-1",
  },
  {
    icon: Target,
    title: "Role-Specific Questions",
    desc: "Tailored questions for 14+ job roles — from Software Engineer to Marketing Manager.",
    tag: "core",
    span: "col-span-1 sm:col-span-2",
  },
  {
    icon: Trophy,
    title: "Performance Tracking",
    desc: "Track progress with score trends, skill radar charts, and full interview history.",
    tag: "optional",
    span: "col-span-1 sm:col-span-2",
  },
  {
    icon: Sparkles,
    title: "AI-Generated Tips",
    desc: "Personalized improvement tips, model answers, and recommended resources after each interview.",
    tag: "optional",
    span: "col-span-1",
  },
];

const roles = [
  { name: "Software Engineer", count: 50, progress: 72 },
  { name: "Product Manager", count: 40, progress: 45 },
  { name: "Data Scientist", count: 45, progress: 58 },
  { name: "UX Designer", count: 30, progress: 33 },
  { name: "DevOps Engineer", count: 35, progress: 41 },
  { name: "ML Engineer", count: 40, progress: 62 },
  { name: "Business Analyst", count: 35, progress: 28 },
  { name: "Marketing Manager", count: 25, progress: 19 },
  { name: "Frontend Developer", count: 45, progress: 67 },
  { name: "Backend Developer", count: 45, progress: 53 },
  { name: "Full Stack Developer", count: 50, progress: 48 },
  { name: "Cloud Architect", count: 30, progress: 35 },
  { name: "QA Engineer", count: 25, progress: 22 },
  { name: "System Design", count: 35, progress: 56 },
];

// Deterministic pseudo-random for waveform animation (avoids hydration mismatch)
function seededValue(index: number, offset: number): number {
  const x = Math.sin(index * 9301 + offset * 4973) * 10000;
  return x - Math.floor(x);
}

const faqs = [
  {
    q: "How does the AI interview work?",
    a: "Our AI interviewer uses Google Gemini's Multimodal Live API to conduct voice-based interviews. You speak naturally, and the AI responds with follow-up questions, just like a real interviewer. Everything is transcribed in real-time.",
  },
  {
    q: "What roles are supported?",
    a: "We support 14+ roles including Software Engineer, Product Manager, Data Scientist, ML Engineer, UX Designer, DevOps, and more. Each role has tailored questions across easy, medium, and hard difficulty levels.",
  },
  {
    q: "How is my interview scored?",
    a: "After each interview, our AI evaluates your answers across 5 dimensions: Technical Accuracy, Communication, Problem Solving, Relevance, and Depth. You receive an overall score plus per-answer breakdowns with model answers.",
  },
  {
    q: "Is it free to use?",
    a: "Yes! You can sign up for free and start practicing immediately. No credit card required.",
  },
  {
    q: "Can I review my past interviews?",
    a: "Absolutely. Your full interview history is saved with transcripts, scores, and feedback. You can track your progress over time with score trends and skill radar charts.",
  },
];

const stats = [
  { value: "14+", label: "Job Roles", icon: BookOpen },
  { value: "3", label: "Difficulty Levels", icon: GraduationCap },
  { value: "5", label: "Score Categories", icon: BarChart3 },
  { value: "Real-time", label: "AI Voice", icon: Mic },
];

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06 }}
      className="rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm overflow-hidden hover:border-white/[0.1] transition-colors"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/[0.03] transition-colors"
      >
        <span className="text-sm font-bold text-white">{q}</span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-4 w-4 text-slate-500 shrink-0 ml-4" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4">
              <p className="text-sm text-slate-400 leading-relaxed">{a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white">
      <Navbar />

      {/* Hero — dotted grid bg */}
      <section className="relative overflow-hidden">
        {/* Dotted grid */}
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1e] via-transparent to-[#0a0f1e]" />
        {/* Radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-blue-500/[0.06] rounded-full blur-[120px]" />

        <div className="relative mx-auto max-w-5xl px-4 pt-24 pb-20 sm:pt-32 sm:pb-28 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-400 mb-8 backdrop-blur-sm"
          >
            <Zap className="h-3 w-3" />
            Powered by Google Gemini
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-5xl font-black leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            ONE STOP Platform For
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
              AI Interview Practice
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="mx-auto mt-6 max-w-2xl text-base text-slate-400 leading-relaxed sm:text-lg"
          >
            Practice real voice interviews with an AI interviewer. Get live transcription,
            personalized roadmaps, detailed scoring, and free resources — all tailored to your target role.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/sign-up">
              <Button
                size="lg"
                className="bg-white text-[#0a0f1e] hover:bg-white/90 px-8 h-12 text-sm font-bold shadow-[0_0_24px_rgba(255,255,255,0.3)] hover:shadow-[0_0_36px_rgba(255,255,255,0.45)] transition-shadow border-0"
              >
                Get Started
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Link href="#features">
              <Button
                size="lg"
                variant="outline"
                className="border-white/10 text-slate-300 hover:bg-white/[0.06] hover:text-white hover:border-white/20 px-8 h-12 text-sm backdrop-blur-sm"
              >
                Explore Paths
              </Button>
            </Link>
          </motion.div>

          {/* Stats row — glass cards */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4 max-w-2xl mx-auto"
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-md px-4 py-4 hover:border-white/[0.12] hover:bg-white/[0.05] transition-all duration-300"
              >
                <stat.icon className="h-4 w-4 text-blue-400" />
                <p className="text-2xl font-black text-white">{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="border-y border-white/[0.06] bg-white/[0.02] py-6">
        <div className="mx-auto max-w-5xl px-4 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-400" />
            <span>
              <strong className="text-white">Free Forever</strong> — No credit card required
            </span>
          </div>
          <div className="hidden sm:block h-4 w-px bg-white/10" />
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-amber-400" />
            <span>
              Built for <strong className="text-white">students &amp; job seekers</strong>
            </span>
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section id="features" className="py-20 sm:py-28 px-4">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl font-black text-white sm:text-4xl tracking-tight">
              Everything you need to{" "}
              <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                land the job
              </span>
            </h2>
            <p className="mt-4 text-slate-400 max-w-xl mx-auto text-sm">
              A complete interview preparation platform built with cutting-edge AI technology
            </p>
          </motion.div>

          {/* Bento grid */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
            {features.map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className={`group rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-md p-6 hover:border-white/[0.12] hover:bg-white/[0.04] transition-all duration-300 ${feat.span}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-white/[0.06]">
                    <feat.icon className="h-5 w-5 text-blue-400" />
                  </div>
                  <span
                    className={`px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full tracking-wider ${feat.tag === "core"
                      ? "bg-blue-500/15 text-blue-400 border border-blue-500/20"
                      : "bg-white/[0.06] text-slate-500 border border-white/[0.06]"
                      }`}
                  >
                    {feat.tag}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mb-2">{feat.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interview Preview Card */}
      <section className="py-20 sm:py-24 px-4 border-y border-white/[0.06] bg-white/[0.01]">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-black text-white sm:text-4xl tracking-tight">
              See it in action
            </h2>
            <p className="mt-4 text-slate-400 text-sm">
              A realistic preview of the live interview experience
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl shadow-2xl shadow-blue-500/[0.05] overflow-hidden"
          >
            {/* Window chrome */}
            <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3 bg-white/[0.02]">
              <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
              <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
              <div className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
              <span className="ml-3 text-xs text-slate-500 font-mono">
                Live Interview — Software Engineer — Medium
              </span>
            </div>
            <div className="p-6 space-y-5">
              {/* AI Message */}
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
                  <Brain className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-bold text-blue-400">AI Interviewer</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] text-slate-500">Question 3 of 10</span>
                  </div>
                  <div className="rounded-xl bg-white/[0.04] border border-white/[0.06] px-4 py-3">
                    <p className="text-sm text-slate-300 leading-relaxed">
                      Tell me about a time you had to debug a particularly challenging issue in production. How did you approach it?
                    </p>
                  </div>
                </div>
              </div>

              {/* Waveform */}
              <div className="flex items-center gap-0.5 px-12 h-10">
                {Array.from({ length: 50 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 rounded-full bg-blue-400/30"
                    animate={{
                      height: [
                        `${6 + seededValue(i, 1) * 16}px`,
                        `${12 + seededValue(i, 2) * 20}px`,
                        `${6 + seededValue(i, 3) * 16}px`,
                      ],
                    }}
                    transition={{
                      duration: 0.8 + seededValue(i, 4) * 0.4,
                      repeat: Infinity,
                      delay: i * 0.025,
                    }}
                    style={{ minHeight: "3px" }}
                  />
                ))}
              </div>

              {/* Bottom bar */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-500">
                  <Mic className="h-3.5 w-3.5 text-blue-400" />
                  <span className="font-mono">Recording...</span>
                </div>
                <span className="font-mono text-slate-500">12:34</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Roles Grid */}
      <section className="py-20 sm:py-28 px-4">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-black text-white sm:text-4xl tracking-tight">
              Interview Preparation Sheet
            </h2>
            <p className="mt-4 text-slate-400 text-sm">
              Tailored question banks for every role — track your progress as you practice
            </p>
          </motion.div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {roles.map((role, i) => {
              const progress = role.progress;
              return (
                <motion.div
                  key={role.name}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.03 }}
                  className="rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-4 hover:border-white/[0.12] hover:bg-white/[0.04] transition-all duration-300 cursor-default"
                >
                  <div className="flex items-center justify-between mb-2.5">
                    <h3 className="text-sm font-bold text-white">{role.name}</h3>
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-500/15 text-blue-400 rounded-full border border-blue-500/20">
                      {role.count}+ Qs
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mb-1.5">{progress}% explored</div>
                  <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
                    <motion.div
                      className="bg-gradient-to-r from-blue-500 to-violet-500 h-full rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${progress}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: i * 0.03 }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 sm:py-24 px-4 border-y border-white/[0.06] bg-white/[0.01]">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl font-black text-white sm:text-4xl tracking-tight">
              How it works
            </h2>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                step: "1",
                title: "Pick your role",
                desc: "Choose from 14+ job roles and select your difficulty level.",
              },
              {
                step: "2",
                title: "Practice live",
                desc: "Have a real-time voice conversation with your AI interviewer.",
              },
              {
                step: "3",
                title: "Get scored",
                desc: "Receive detailed feedback, scores, and tips to improve.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-8 hover:border-white/[0.12] hover:bg-white/[0.04] transition-all duration-300"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 text-white text-base font-black shadow-lg shadow-blue-500/20">
                  {item.step}
                </div>
                <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 sm:py-28 px-4">
        <div className="mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-black text-white sm:text-4xl tracking-tight">
              Frequently asked questions
            </h2>
            <p className="mt-4 text-slate-400 text-sm">
              Got questions? We&apos;ve got answers.
            </p>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-28 px-4 relative overflow-hidden">
        {/* Gradient bg */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-violet-600/10 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-500/[0.08] rounded-full blur-[100px]" />

        <div className="relative mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-black text-white sm:text-5xl tracking-tight">
              Ready to practice?
            </h2>
            <p className="mt-4 text-slate-400 text-lg">
              Sign up for free and start your first AI mock interview.
            </p>
            <ul className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-5 text-sm text-slate-400">
              {["Free to get started", "No credit card required", "14+ job roles"].map(
                (item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-400" />
                    {item}
                  </li>
                )
              )}
            </ul>
            <div className="mt-10">
              <Link href="/sign-up">
                <Button
                  size="lg"
                  className="bg-white text-[#0a0f1e] hover:bg-white/90 px-10 h-12 text-sm font-bold shadow-[0_0_24px_rgba(255,255,255,0.3)] hover:shadow-[0_0_36px_rgba(255,255,255,0.45)] transition-shadow border-0"
                >
                  Start Practicing Now
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
