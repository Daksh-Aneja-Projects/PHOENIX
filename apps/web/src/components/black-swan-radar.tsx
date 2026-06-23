"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, ArrowDown, Bot, RadioTower } from "lucide-react";
import type { AuditLog, SimulationResult } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Panel } from "@/components/ui/panel";
import { cn } from "@/lib/utils";
import { BeforeAfterComparison } from "@/components/before-after-comparison";

const clusterPositions: Record<string, string> = {
  "Winning Futures": "left-[22%] top-[58%]",
  "Stable Futures": "left-[38%] top-[42%]",
  "Risk Futures": "left-[58%] top-[34%]",
  "Failure Futures": "left-[70%] top-[22%]",
  "Black Swan Futures": "left-[83%] top-[12%]"
};



export function BlackSwanRadar({
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
    <Panel className="min-h-[420px]">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <RadioTower className="h-4 w-4 text-cyan-300" />
            <h2 className="font-semibold">Black Swan Radar</h2>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Outcome clusters from strategic delivery simulation.</p>
        </div>
        <Badge>{active ? "Tail risk acquired" : "Scanning outcome space"}</Badge>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative h-[330px] overflow-hidden rounded-md border border-white/10 bg-black/30">
          <div className="radar-ring absolute left-1/2 top-1/2 h-[530px] w-[530px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-[0.2px]" />
          <motion.div
            className="absolute left-1/2 top-1/2 h-[2px] w-[270px] origin-left bg-cyan-300/60"
            animate={{ rotate: active ? 360 : 20 }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          />

          {simulation?.clusters.map((cluster, index) => {
            const blackSwan = cluster.name === "Black Swan Futures";
            return (
              <motion.div
                key={cluster.name}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: active ? 1 : 0.35, scale: active && blackSwan ? [1, 1.45, 1] : 1 }}
                transition={{ delay: index * 0.12, duration: 1.2, repeat: active && blackSwan && !mitigated ? Infinity : 0 }}
                className={cn(
                  "absolute rounded-full border px-3 py-2 text-center shadow-2xl",
                  clusterPositions[cluster.name],
                  blackSwan ? "border-rose-300 bg-rose-400/25 text-rose-50 shadow-danger" : "border-cyan-300/25 bg-cyan-300/10 text-cyan-50",
                  mitigated && blackSwan && "border-emerald-300 bg-emerald-400/20 text-emerald-50"
                )}
              >
                <p className="font-mono text-xs">{cluster.count}</p>
                <p className="text-[11px]">{cluster.name}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="space-y-3">
          <AnimatePresence>
            {active && simulation && (
              <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} className="rounded-md border border-rose-300/30 bg-rose-400/10 p-4">
                <div className="flex items-center gap-2 text-rose-100">
                  <AlertTriangle className="h-5 w-5" />
                  <h3 className="font-semibold">Black Swan Future</h3>
                </div>
                <p className="mt-2 text-2xl font-semibold">{(simulation.black_swan.probability * 100).toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground">{simulation.black_swan.title}</p>
                <p className="mt-3 text-xs text-rose-100">{simulation.black_swan.trigger}</p>
                <div className="mt-3 space-y-2">
                  {simulation.black_swan.causal_chain.map((step, index) => (
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.12 }}
                      className="relative rounded border border-white/10 bg-black/20 px-3 py-2 text-xs text-slate-200"
                    >
                      {index > 0 && (
                        <span className="absolute -top-4 left-5 grid h-4 w-4 place-items-center rounded-full bg-rose-300/20 text-rose-100">
                          <ArrowDown className="h-3 w-3" />
                        </span>
                      )}
                      <div className="flex items-start justify-between gap-3">
                        <span className="font-semibold text-white">{step}</span>
                        <span className="max-w-[180px] text-right text-[11px] text-cyan-100">
                          Source: {simulation.black_swan.orbit_evidence[index] ?? "Orbit"}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="rounded-md border border-white/10 bg-white/[0.04] p-4">
            <div className="mb-3 flex items-center gap-2">
              <Bot className="h-4 w-4 text-cyan-300" />
              <h3 className="text-sm font-semibold">Mitigation Agents</h3>
            </div>
            <div className="space-y-2">
              {(audit?.actions ?? []).map((action, index) => (
                <motion.div
                  key={action.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between gap-3 rounded border border-emerald-300/20 bg-emerald-400/8 px-3 py-2"
                >
                  <span className="text-xs text-emerald-50">{action.title}</span>
                  <span className="font-mono text-[10px] uppercase text-emerald-200">{action.status}</span>
                </motion.div>
              ))}
              {!audit && <p className="text-xs text-muted-foreground">Agents standing by for review, validation, work item, MR comment, and rollout gate.</p>}
            </div>
          </div>
        </div>
      </div>
      <BeforeAfterComparison visible={mitigated} />
    </Panel>
  );
}
