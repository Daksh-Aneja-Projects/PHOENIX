"use client";

import { Check, SearchCode } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const orbitReveals = [
  "Ownership Graph",
  "Vulnerability Graph",
  "Incident Memory",
  "Work Item Dependencies",
  "Deployment Topology",
  "Business Objectives"
];

export function OrbitMoment({ active, complete }: { active: boolean; complete: boolean }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 grid place-items-center bg-slate-950/88 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.96, y: 18 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.98, opacity: 0 }}
            className="w-[min(720px,92vw)] rounded-lg border border-cyan-300/25 bg-slate-950/95 p-6 shadow-glow"
          >
            <div className="flex items-center gap-3">
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
                className="grid h-11 w-11 place-items-center rounded-full border border-cyan-300/35 bg-cyan-300/10"
              >
                <SearchCode className="h-5 w-5 text-cyan-200" />
              </motion.span>
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-cyan-200">GitLab Orbit substrate</p>
                <h2 className="mt-1 text-2xl font-semibold text-white">Analyzing Orbit Context...</h2>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {orbitReveals.map((label, index) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.85, duration: 0.35 }}
                  className="flex items-center gap-3 rounded-md border border-white/10 bg-white/[0.04] px-3 py-3"
                >
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-300/15 text-emerald-200">
                    <Check className="h-4 w-4" />
                  </span>
                  <span className="text-sm text-slate-100">{label}</span>
                </motion.div>
              ))}
            </div>

            <AnimatePresence>
              {complete && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-6 rounded-md border border-rose-300/35 bg-rose-400/12 p-4 text-center shadow-danger"
                >
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-rose-100">Outcome space anomaly</p>
                  <p className="mt-1 text-2xl font-semibold text-white">1 Hidden Future Detected</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

