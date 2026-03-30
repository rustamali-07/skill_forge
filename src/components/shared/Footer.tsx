"use client";

import Link from "next/link";
import { Brain, Github, Users } from "lucide-react";

const students = [
    { name: "Atif Shaikh", id: "2207190100042" },
    { name: "Mohd Yahiya", id: "2207190100074" },
    { name: "Rustam Ali", id: "2207190100097" },
];

const footerLinks = [
    { label: "Features", href: "/#features" },
    { label: "Pricing", href: "/pricing" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Practice", href: "/interview/setup" },
];

export function Footer() {
    return (
        <footer className="border-t border-white/[0.06] bg-[#060a14] px-4 pt-12 pb-8">
            <div className="mx-auto max-w-6xl">
                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Brand column */}
                    <div className="sm:col-span-2 lg:col-span-1">
                        <div className="flex items-center gap-2.5 mb-3">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-600">
                                <Brain className="h-3.5 w-3.5 text-white" />
                            </div>
                            <span className="font-black text-white text-base">
                                SkillForge
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
                            AI-powered mock interview platform built with Google Gemini.
                            Practice real interviews, get scored, and land your dream job.
                        </p>
                        {/* GitHub */}
                        <div className="mt-4">
                            <Link
                                href="https://github.com/rustamali-07/skill_forge"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-slate-500 hover:text-white hover:bg-white/[0.06] hover:border-white/[0.12] transition-all text-xs"
                            >
                                <Github className="h-4 w-4" />
                                <span>View on GitHub</span>
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                            Quick Links
                        </h4>
                        <ul className="space-y-2.5">
                            {footerLinks.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-slate-500 hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* About Us */}
                    <div className="sm:col-span-2 lg:col-span-2">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                            About Us
                        </h4>
                        <p className="text-sm text-slate-500 leading-relaxed mb-5">
                            SkillForge is a project developed as part of our academic
                            curriculum. We built this platform to help students and job
                            seekers practice for real interviews using cutting-edge AI
                            technology.
                        </p>

                        {/* Student details */}
                        <div className="flex items-center gap-2 mb-3">
                            <Users className="h-3.5 w-3.5 text-blue-400" />
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                Team Members
                            </span>
                        </div>
                        <div className="grid gap-2 sm:grid-cols-3">
                            {students.map((s) => (
                                <div
                                    key={s.id}
                                    className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2.5"
                                >
                                    <p className="text-sm font-semibold text-white">{s.name}</p>
                                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                                        {s.id}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-10 pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-slate-600">
                        © {new Date().getFullYear()} SkillForge. All rights reserved.
                    </p>
                    <Link
                        href="https://github.com/rustamali-07/skill_forge"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-400 transition-colors"
                    >
                        <Github className="h-3 w-3" />
                        Open Source Project
                    </Link>
                </div>
            </div>
        </footer>
    );
}
