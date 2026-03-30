import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center px-4 py-24">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/3 h-96 w-96 rounded-full bg-teal-500/6 blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 h-80 w-80 rounded-full bg-violet-500/6 blur-3xl" />
      </div>
      <div className="relative z-10">
        <SignUp
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "bg-[#111827] border border-white/[0.08] shadow-2xl rounded-2xl",
              headerTitle: "text-white font-display font-black",
              headerSubtitle: "text-slate-400",
              formFieldLabel: "text-slate-300 text-sm",
              formFieldInput:
                "bg-white/[0.06] border-white/10 text-white placeholder-slate-500 focus:border-teal-500/50",
              formButtonPrimary:
                "bg-gradient-to-r from-teal-500 to-violet-500 hover:opacity-90 text-white font-semibold",
              footerActionText: "text-slate-400",
              footerActionLink: "text-teal-400 hover:text-teal-300",
              dividerLine: "bg-white/[0.06]",
              dividerText: "text-slate-600",
              socialButtonsBlockButton:
                "border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.08]",
              socialButtonsBlockButtonText: "text-slate-300",
            },
          }}
        />
      </div>
    </div>
  );
}
