"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
    Check,
    Sparkles,
    Zap,
    Crown,
    ArrowRight,
    Star,
} from "lucide-react";
import { cn } from "@/lib/utils";

const plans = [
    {
        name: "Basic",
        price: 3,
        description: "Perfect for getting started with AI interview prep.",
        icon: Zap,
        color: "teal",
        gradient: "from-teal-500 to-emerald-500",
        glow: "shadow-teal-500/20",
        border: "border-teal-500/20 hover:border-teal-500/40",
        badge: null,
        features: [
            "5 AI mock interviews / month",
            "Basic performance scoring",
            "3 job role categories",
            "Text-based feedback",
            "Interview transcript history",
            "Email support",
        ],
        cta: "Get Started",
    },
    {
        name: "Pro",
        price: 9,
        description: "For serious candidates who want an edge in interviews.",
        icon: Sparkles,
        color: "violet",
        gradient: "from-violet-500 to-purple-600",
        glow: "shadow-violet-500/30",
        border: "border-violet-500/30 hover:border-violet-500/50",
        badge: "Most Popular",
        features: [
            "25 AI mock interviews / month",
            "Advanced scoring with breakdown",
            "All 14+ job roles",
            "Detailed Q&A review",
            "Personalized improvement tips",
            "Voice interview with AI",
            "Recording & playback",
            "Priority support",
        ],
        cta: "Upgrade to Pro",
    },
    {
        name: "Max",
        price: 19,
        description: "Unlimited access for teams and power users.",
        icon: Crown,
        color: "amber",
        gradient: "from-amber-500 to-orange-500",
        glow: "shadow-amber-500/20",
        border: "border-amber-500/20 hover:border-amber-500/40",
        badge: "Best Value",
        features: [
            "Unlimited AI mock interviews",
            "Expert-level scoring & analytics",
            "All job roles + custom roles",
            "Full Q&A review with model answers",
            "Personalized roadmaps & resources",
            "Voice interview with AI",
            "Recording, playback & export",
            "Resume-tailored questions",
            "Team dashboard (up to 5 users)",
            "Dedicated support",
        ],
        cta: "Go Max",
    },
];

const faqs = [
    {
        q: "Can I cancel anytime?",
        a: "Yes — cancel your subscription at any time with no hidden fees. You'll retain access until the end of your billing period.",
    },
    {
        q: "Do unused interviews roll over?",
        a: "Monthly interview credits reset each billing cycle. Upgrade to Max for unlimited interviews.",
    },
    {
        q: "Is there a free trial?",
        a: "Every new account gets 2 free interviews to try the platform before subscribing.",
    },
    {
        q: "Can I switch plans?",
        a: "Absolutely — upgrade or downgrade your plan at any time. Changes take effect on your next billing cycle.",
    },
];

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-[#0a0f1e]">
            <Navbar />

            <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-24 pb-20">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 mb-6">
                        <Star className="h-3.5 w-3.5 text-violet-400" />
                        <span className="text-xs font-semibold text-violet-300 tracking-wide">
                            Simple, Transparent Pricing
                        </span>
                    </div>

                    <h1 className="font-display text-4xl sm:text-5xl font-black text-white leading-tight">
                        Invest in Your
                        <span className="block bg-gradient-to-r from-teal-400 via-violet-400 to-amber-400 bg-clip-text text-transparent">
                            Interview Success
                        </span>
                    </h1>
                    <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
                        Choose the plan that fits your career goals. All plans include
                        AI-powered interviews, detailed feedback, and real-time scoring.
                    </p>
                </motion.div>

                {/* Plans */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {plans.map((plan, i) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.12 }}
                            className={cn(
                                "relative flex flex-col rounded-2xl border bg-white/[0.02] p-6 sm:p-8 transition-all duration-300",
                                plan.border,
                                plan.name === "Pro" && "lg:scale-[1.04] lg:-my-2 z-10"
                            )}
                        >
                            {/* Popular badge */}
                            {plan.badge && (
                                <div
                                    className={cn(
                                        "absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-bold tracking-wide text-white",
                                        `bg-gradient-to-r ${plan.gradient} shadow-lg ${plan.glow}`
                                    )}
                                >
                                    {plan.badge}
                                </div>
                            )}

                            {/* Plan header */}
                            <div className="mb-6">
                                <div
                                    className={cn(
                                        "inline-flex h-10 w-10 items-center justify-center rounded-xl mb-4",
                                        `bg-gradient-to-br ${plan.gradient} shadow-lg ${plan.glow}`
                                    )}
                                >
                                    <plan.icon className="h-5 w-5 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                                <p className="text-sm text-slate-500 mt-1">{plan.description}</p>
                            </div>

                            {/* Price */}
                            <div className="mb-6">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-sm text-slate-500">$</span>
                                    <span className="font-display text-5xl font-black text-white">
                                        {plan.price}
                                    </span>
                                    <span className="text-sm text-slate-500 ml-1">/ month</span>
                                </div>
                            </div>

                            {/* Features */}
                            <ul className="flex-1 space-y-3 mb-8">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-start gap-3">
                                        <div
                                            className={cn(
                                                "mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full",
                                                plan.name === "Pro"
                                                    ? "bg-violet-500/20 text-violet-400"
                                                    : plan.name === "Max"
                                                        ? "bg-amber-500/20 text-amber-400"
                                                        : "bg-teal-500/20 text-teal-400"
                                            )}
                                        >
                                            <Check className="h-3 w-3" />
                                        </div>
                                        <span className="text-sm text-slate-300">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* CTA */}
                            <Link href="/sign-up">
                                <Button
                                    className={cn(
                                        "w-full h-11 font-bold text-sm transition-all",
                                        plan.name === "Pro"
                                            ? `bg-gradient-to-r ${plan.gradient} text-white border-0 shadow-lg ${plan.glow} hover:opacity-90`
                                            : plan.name === "Max"
                                                ? `bg-gradient-to-r ${plan.gradient} text-white border-0 shadow-lg ${plan.glow} hover:opacity-90`
                                                : "bg-white/[0.08] text-white border border-white/10 hover:bg-white/[0.12]"
                                    )}
                                >
                                    {plan.cta}
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Trust strip */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-16 text-center"
                >
                    <p className="text-sm text-slate-600">
                        Trusted by <span className="text-slate-400 font-medium">2,500+</span>{" "}
                        candidates who improved their interview skills with SkillForge
                    </p>
                </motion.div>

                {/* FAQ */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-20"
                >
                    <h2 className="text-center font-display text-2xl font-black text-white mb-10">
                        Frequently Asked Questions
                    </h2>
                    <div className="grid gap-4 sm:grid-cols-2 max-w-4xl mx-auto">
                        {faqs.map((faq) => (
                            <div
                                key={faq.q}
                                className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5"
                            >
                                <h3 className="font-semibold text-white text-sm mb-2">
                                    {faq.q}
                                </h3>
                                <p className="text-sm text-slate-500 leading-relaxed">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="mt-20 text-center"
                >
                    <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.04] to-transparent p-10 sm:p-14">
                        <h2 className="font-display text-3xl font-black text-white mb-3">
                            Ready to Ace Your Next Interview?
                        </h2>
                        <p className="text-slate-400 mb-6 max-w-lg mx-auto">
                            Start practicing with AI-powered mock interviews today. No credit
                            card required for your first 2 free interviews.
                        </p>
                        <Link href="/sign-up">
                            <Button className="bg-gradient-to-r from-teal-500 to-violet-500 text-white border-0 h-12 px-8 font-bold text-base shadow-lg shadow-violet-500/20 hover:opacity-90">
                                Start Free
                                <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </div>

            <Footer />
        </div>
    );
}
