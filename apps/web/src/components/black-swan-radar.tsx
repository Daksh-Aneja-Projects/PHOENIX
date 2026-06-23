"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, ArrowDown, Activity } from "lucide-react";
import type { SimulationResult } from "@/lib/types";

export function BlackSwanRadar({
  simulation,
  active,
  mitigated
}: {
  simulation?: SimulationResult;
  active: boolean;
  mitigated: boolean;
}) {
  if (!active || !simulation) {
    return (
      <div className="rounded-lg border border-white/10 bg-black/40 p-4 flex items-center gap-3">
        <Activity className="h-5 w-5 text-slate-400 animate-pulse" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-200">Black Swan Surface</p>
          <p className="text-[10px] text-slate-400 font-mono">Awaiting simulation triggers...</p>
        </div>
      </div>
    );
  }

  const { black_swan } = simulation;
  const isMitigated = mitigated;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, height: 0 }}
      animate={{ opacity: 1, scale: 1, height: "auto" }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className={`rounded-lg border p-5 backdrop-blur-xl relative overflow-hidden shadow-2xl ${
        isMitigated 
          ? "border-emerald-500/30 bg-emerald-950/20 shadow-emerald-500/10" 
          : "border-rose-500/50 bg-rose-950/30 shadow-rose-500/20"
      }`}
    >
      {/* Background dramatic pulse if not mitigated */}
      {!isMitigated && (
        <motion.div
          animate={{ opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-rose-600/20 via-transparent to-transparent pointer-events-none"
        />
      )}

      <div className="relative z-10 flex items-start justify-between mb-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex items-center gap-2">
          <AlertTriangle className={`h-6 w-6 ${isMitigated ? "text-emerald-400" : "text-rose-400 animate-pulse"}`} />
          <h2 className="text-sm font-bold uppercase tracking-widest text-white">Black Swan Discovered</h2>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.0, type: "spring" }} className={`text-2xl font-black ${isMitigated ? "text-emerald-400" : "text-rose-400 drop-shadow-[0_0_10px_rgba(244,63,94,0.8)]"}`}>
          {(black_swan.probability * 100).toFixed(1)}%
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 2.0 }} className="relative z-10 mb-6">
        <p className="text-lg font-semibold text-white leading-tight">{black_swan.title}</p>
        <p className={`text-xs mt-2 font-mono uppercase tracking-widest ${isMitigated ? "text-emerald-300/80" : "text-rose-300/80"}`}>
          Impact: {black_swan.impact}
        </p>
      </motion.div>

      <div className="relative z-10 space-y-3">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.0 }} className="text-[10px] text-white/50 uppercase tracking-widest mb-2 border-b border-white/10 pb-1">Causal Chain</motion.p>
        {black_swan.causal_chain.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.4 + 3.5 }}
            className={`relative rounded border bg-black/40 p-3 text-xs ${
              isMitigated ? "border-emerald-500/20 text-emerald-100" : "border-rose-500/30 text-rose-100"
            }`}
          >
            {index > 0 && (
              <span className={`absolute -top-4 left-6 grid h-4 w-4 place-items-center rounded-full ${
                isMitigated ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-300"
              }`}>
                <ArrowDown className="h-3 w-3" />
              </span>
            )}
            <div className="flex flex-col gap-1">
              <span className="font-semibold">{step}</span>
              <span className="text-[10px] font-mono text-cyan-200/70">Evidence: {black_swan.orbit_evidence[index] ?? "Orbit"}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
