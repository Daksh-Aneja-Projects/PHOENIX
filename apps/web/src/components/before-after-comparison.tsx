"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { motion } from "framer-motion";

const before = ["Pipeline Green", "Risk Hidden", "No Coordination"];
const after = ["Black Swan Found", "Validation Triggered", "Security Review Requested", "Risk Reduced"];

export function BeforeAfterComparison({ visible }: { visible: boolean }) {
  if (!visible) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 grid gap-3 md:grid-cols-2"
    >
      <div className="rounded-md border border-rose-300/25 bg-rose-400/8 p-4">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-rose-100">Before Phoenix</p>
        <div className="mt-3 space-y-2">
          {before.map((item) => (
            <div key={item} className="flex items-center gap-2 text-sm text-slate-200">
              <XCircle className="h-4 w-4 text-rose-300" />
              {item}
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-md border border-emerald-300/25 bg-emerald-400/8 p-4">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-emerald-100">After Phoenix</p>
        <div className="mt-3 space-y-2">
          {after.map((item, index) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-2 text-sm text-slate-100"
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-300" />
              {item}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

