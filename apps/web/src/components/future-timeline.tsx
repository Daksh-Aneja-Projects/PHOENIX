"use client";

import { motion } from "framer-motion";
import { Clock3, GitMerge, AlertCircle, ShieldCheck, Divide } from "lucide-react";
import type { SimulationResult } from "@/lib/types";

export function FutureTimeline({ simulation, active, mitigated }: { simulation?: SimulationResult; active: boolean; mitigated: boolean }) {
  if (!simulation) {
    return (
      <div className="h-full flex flex-col justify-center items-center opacity-30">
        <Clock3 className="h-8 w-8 text-cyan-500 mb-4 animate-pulse" />
        <p className="font-mono text-sm uppercase tracking-widest text-cyan-200">Awaiting Simulation</p>
      </div>
    );
  }

  const icons = [GitMerge, AlertCircle, ShieldCheck, Divide];

  return (
    <div className="h-full flex flex-col p-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock3 className="h-4 w-4 text-cyan-400" />
        <h2 className="font-semibold text-sm uppercase tracking-wider text-cyan-50">Future Divergence Timeline</h2>
        <span className="ml-4 text-[10px] font-mono text-cyan-300/50 uppercase tracking-widest">300 Futures Simulated</span>
      </div>

      <div className="flex-1 flex flex-col gap-2 relative">
        {/* Timeline Axis */}
        <div className="absolute top-0 bottom-0 left-[200px] right-0 flex justify-between px-4 pointer-events-none">
          {[0, 1, 7, 30].map((day, idx) => (
            <div key={day} className="h-full flex flex-col items-center">
              <div className="w-px flex-1 bg-white/5 border-l border-dashed border-white/10" />
              <div className="mt-2 text-[9px] font-mono text-slate-500 uppercase">Day {day === 0 ? "Now" : `+${day}`}</div>
            </div>
          ))}
        </div>

        {/* Strategies Divergence */}
        {simulation.strategies.map((strategy, index) => {
          const Icon = icons[index % icons.length];
          const isMergeNow = strategy.id === "merge_now";
          const highlight = isMergeNow && !mitigated ? "text-rose-400 border-rose-500/30 bg-rose-500/10" : "text-cyan-300 border-cyan-500/20 bg-cyan-500/5";
          
          return (
            <motion.div
              key={strategy.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: active ? 1 : 0.3, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex-1 flex items-center rounded-lg border backdrop-blur-sm relative z-10 ${highlight} overflow-hidden`}
            >
              {/* Strategy Header */}
              <div className="w-[200px] px-4 py-2 border-r border-white/10 flex flex-col justify-center bg-black/40 h-full">
                <div className="flex items-center gap-2 mb-1">
                  <Icon className="h-3 w-3" />
                  <span className="text-xs font-semibold uppercase tracking-wider">{strategy.name}</span>
                </div>
                <div className="text-[10px] font-mono opacity-60">Risk: {strategy.risk_score} / Conf: {(strategy.confidence * 100).toFixed(0)}%</div>
              </div>

              {/* Timeline Track */}
              <div className="flex-1 flex justify-between items-center px-4 h-full relative">
                {/* Connecting Line */}
                <div className="absolute left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent top-1/2 -translate-y-1/2" />

                {strategy.timeline.map((point, pIndex) => {
                  const isHighRisk = point.risk >= 70;
                  const nodeColor = isHighRisk && (!mitigated || isMergeNow) ? "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]" : "bg-cyan-500";
                  
                  return (
                    <div key={point.day} className="relative z-10 flex flex-col items-center group cursor-crosshair">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: active ? 1 : 0 }}
                        transition={{ delay: (index * 0.1) + (pIndex * 0.2) }}
                        className={`h-2 w-2 rounded-full ${nodeColor} group-hover:scale-150 transition-transform`}
                      />
                      <div className="absolute top-4 opacity-0 group-hover:opacity-100 transition-opacity bg-black/90 border border-white/20 p-2 rounded text-[10px] w-32 -translate-x-1/2 left-1/2 pointer-events-none shadow-2xl">
                        <div className="text-white font-semibold mb-1">Risk Level: {point.risk}</div>
                        <div className="text-muted-foreground leading-tight">{point.label}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
