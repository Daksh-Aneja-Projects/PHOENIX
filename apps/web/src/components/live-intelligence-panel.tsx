"use client";

import { motion } from "framer-motion";
import { BrainCircuit, Bot, ShieldCheck, Zap } from "lucide-react";
import type { SimulationResult, AuditLog } from "@/lib/types";

export function LiveIntelligencePanel({
  simulation,
  audit,
  active,
  mitigated
}: {
  simulation?: SimulationResult;
  audit?: AuditLog;
  active: boolean;
  mitigated: boolean;
}) {
  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Decision Intelligence */}
      {simulation?.decision && active && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="rounded-lg border border-cyan-300/30 bg-cyan-900/20 p-4 backdrop-blur-md">
          <div className="flex items-center gap-2 text-cyan-200 mb-3">
            <ShieldCheck className="h-5 w-5" />
            <h2 className="font-semibold text-sm uppercase tracking-wider">Decision Intelligence</h2>
          </div>
          
          <div className="mb-4">
            <p className="text-[10px] text-cyan-300/60 uppercase tracking-widest mb-1">Recommended Strategy</p>
            <p className="text-xl font-bold text-white">{simulation.decision.strategy}</p>
            <p className="text-xs text-cyan-100 mt-1">{simulation.decision.expected_impact}</p>
          </div>

          <div className="space-y-2 mb-4">
            <p className="text-[10px] text-cyan-300/60 uppercase tracking-widest">Orbit Signals Used</p>
            {simulation.decision.supporting_evidence.map((evidence: string, idx: number) => (
              <div key={idx} className="text-xs text-cyan-50 flex items-center gap-2 bg-black/40 rounded p-1.5 border border-white/5">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                <span dangerouslySetInnerHTML={{ __html: evidence.replace('→', '<span class="text-cyan-400 mx-1">→</span><strong class="text-white">').concat('</strong>') }} />
              </div>
            ))}
          </div>

          {simulation.decision.rejected_alternatives.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-cyan-300/20">
              <p className="text-[10px] text-cyan-300/60 uppercase tracking-widest">Rejected Strategies</p>
              {simulation.decision.rejected_alternatives.map((alt: any, idx: number) => (
                <div key={idx} className="text-xs">
                  <span className="text-rose-200 line-through mr-2">{alt.strategy}</span>
                  <span className="text-muted-foreground">{alt.reason}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Agent Operations Feed */}
      {active && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="rounded-lg border border-emerald-300/30 bg-emerald-900/10 p-4 backdrop-blur-md">
          <div className="flex items-center gap-2 text-emerald-300 mb-3">
            <Bot className="h-5 w-5" />
            <h2 className="font-semibold text-sm uppercase tracking-wider">Mission Operations</h2>
          </div>
          <div className="space-y-2">
            {(audit?.actions ?? []).map((action, index) => {
              // Calculate stagger state based on mitigated flag
              // Since we don't have complex client state, we'll use framer-motion variants and delays to simulate execution
              const isExecuted = mitigated;
              
              return (
                <motion.div
                  key={action.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center justify-between gap-3 rounded border px-3 py-2 ${
                    isExecuted ? "border-emerald-500/40 bg-emerald-900/30" : "border-emerald-300/20 bg-emerald-400/10"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isExecuted ? (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: index * 0.6 + 0.2 }}>
                        <ShieldCheck className="h-4 w-4 text-emerald-400" />
                      </motion.div>
                    ) : (
                      <Zap className="h-3 w-3 text-emerald-400" />
                    )}
                    <span className={`text-xs ${isExecuted ? "text-emerald-100 font-semibold" : "text-emerald-50"}`}>
                      {action.title}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] uppercase text-emerald-200">
                    {isExecuted ? (
                      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.6 + 0.4 }} className="text-emerald-400">
                        EXECUTED
                      </motion.span>
                    ) : (
                      "PLANNED"
                    )}
                  </span>
                </motion.div>
              );
            })}
            {!audit && (
              <div className="flex items-center justify-center py-4 border border-dashed border-white/10 rounded bg-black/20">
                <p className="text-xs font-mono text-muted-foreground animate-pulse">Agents standing by for rollout gate...</p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
