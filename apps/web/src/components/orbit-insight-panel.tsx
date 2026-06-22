"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const orbitSignals = [
  { signal: "Merge Request", detail: "MR #4821 session validation", impact: "High", confidence: 94 },
  { signal: "Team Ownership", detail: "Identity and Security owners", impact: "Medium", confidence: 88 },
  { signal: "Work Items", detail: "Enterprise SSO Launch", impact: "High", confidence: 92 },
  { signal: "Vulnerabilities", detail: "JWT library stale version", impact: "High", confidence: 89 },
  { signal: "Historical Incidents", detail: "Session Invalidation Outage", impact: "High", confidence: 91 },
  { signal: "Pipelines", detail: "Mobile contract tests missing", impact: "High", confidence: 86 },
  { signal: "Deployment Topology", detail: "Canary before production", impact: "Medium", confidence: 84 },
  { signal: "Business Objective", detail: "Enterprise adoption launch", impact: "High", confidence: 90 }
];

export function OrbitInsightPanel({ active }: { active: boolean }) {
  return (
    <div className="mt-3 rounded-md border border-cyan-300/18 bg-cyan-300/[0.045] p-3">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-cyan-50">Orbit Signals Used</h3>
          <p className="text-xs text-muted-foreground">Phoenix reasoning is grounded in GitLab Orbit context.</p>
        </div>
        <Badge>{active ? "Context fused" : "Waiting"}</Badge>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {orbitSignals.map((item, index) => (
          <motion.div
            key={item.signal}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: active ? 1 : 0.45, y: 0 }}
            transition={{ delay: active ? index * 0.05 : 0 }}
            className="rounded border border-white/10 bg-black/20 px-3 py-2"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-semibold text-white">{item.signal}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">{item.detail}</p>
              </div>
              <span className="font-mono text-[10px] uppercase text-rose-100">{item.impact}</span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <div className="h-1.5 flex-1 rounded-full bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: active ? `${item.confidence}%` : "0%" }}
                  transition={{ delay: active ? index * 0.05 + 0.2 : 0, duration: 0.45 }}
                  className="h-full rounded-full bg-cyan-300"
                />
              </div>
              <span className="font-mono text-[10px] text-cyan-100">{item.confidence}%</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

