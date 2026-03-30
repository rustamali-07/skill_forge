"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { JOB_ROLES } from "@/types";

interface RoleSelectorProps {
  selected: string;
  onSelect: (role: string) => void;
}

const categories = Array.from(new Set(JOB_ROLES.map((r) => r.category)));

export function RoleSelector({ selected, onSelect }: RoleSelectorProps) {
  return (
    <div className="space-y-4">
      {categories.map((category) => (
        <div key={category}>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            {category}
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {JOB_ROLES.filter((r) => r.category === category).map((role) => (
              <motion.button
                key={role.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelect(role.label)}
                className={cn(
                  "rounded-xl border px-3 py-3 text-left text-sm font-medium transition-all",
                  selected === role.label
                    ? "border-teal-500/60 bg-teal-500/10 text-teal-300 shadow-sm shadow-teal-500/10"
                    : "border-white/[0.08] bg-white/[0.03] text-slate-300 hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
                )}
              >
                {role.label}
              </motion.button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
