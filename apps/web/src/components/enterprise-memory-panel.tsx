"use client";

import { motion } from "framer-motion";
import { BrainCircuit } from "lucide-react";
import type { OrbitExplainability } from "@/lib/types";

export function EnterpriseMemoryPanel({ explain, active }: { explain?: OrbitExplainability, active: boolean }) {
  if (!active || !explain) {
    return (
      <div className="rounded-lg border border-white/5 bg-black/20 p-4 flex items-center gap-3 opacity-50">
        <BrainCircuit className="h-5 w-5 text-slate-500 animate-pulse" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Enterprise Memory</p>
          <p className="text-[10px] text-slate-500 font-mono">Awaiting ingestion...</p>
        </div>
      </div>
    );
  }

  const memoryTypes = [
    { key: "incident_memory", label: "Historical Incidents", color: "text-rose-300", border: "border-rose-500/20" },
    { key: "ownership_memory", label: "Ownership Knowledge", color: "text-cyan-300", border: "border-cyan-500/20" },
    { key: "deployment_memory", label: "Deployment Patterns", color: "text-emerald-300", border: "border-emerald-500/20" },
    { key: "dependency_memory", label: "Dependency Web", color: "text-amber-300", border: "border-amber-500/20" },
    { key: "objective_memory", label: "Strategic Objectives", color: "text-purple-300", border: "border-purple-500/20" },
    // Some endpoints may not return all of these yet, but we map them defensively.
    { key: "work_item_memory", label: "Work Item Backlog", color: "text-blue-300", border: "border-blue-500/20" },
    { key: "contributor_memory", label: "Contributor Velocity", color: "text-indigo-300", border: "border-indigo-500/20" },
    { key: "release_memory", label: "Release History", color: "text-teal-300", border: "border-teal-500/20" }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4 p-4 rounded-lg border border-white/10 bg-black/40 backdrop-blur-md">
      <div className="flex items-center gap-2 text-slate-200 mb-2 border-b border-white/10 pb-3">
        <BrainCircuit className="h-5 w-5" />
        <h2 className="font-semibold text-sm uppercase tracking-wider">Enterprise Memory</h2>
      </div>
      
      <div className="space-y-4">
        {memoryTypes.map((mt, index) => {
          // @ts-ignore - dynamic key access for explain object
          const memories = explain[mt.key];
          if (!memories || memories.length === 0) return null;

          return (
            <motion.div 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: index * 0.1 }}
              key={mt.key}
            >
              <h3 className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-2">{mt.label}</h3>
              <div className="space-y-2">
                {memories.slice(0, 3).map((m: any) => (
                  <div key={m.id} className={`text-xs bg-black/60 border ${mt.border} rounded p-3`}>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className={`font-semibold ${mt.color}`}>{m.title}</span>
                      <span className="text-[9px] font-mono opacity-50 px-1 border border-white/10 rounded">
                        Rel: {m.relevance_score.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">{m.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
