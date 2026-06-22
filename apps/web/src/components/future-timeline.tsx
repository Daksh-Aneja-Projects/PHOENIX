"use client";

import { motion } from "framer-motion";
import { Clock3 } from "lucide-react";
import { useState } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { SimulationResult } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Panel } from "@/components/ui/panel";

const dayLabels = [0, 1, 7, 30];

export function FutureTimeline({ simulation, active, mitigated }: { simulation?: SimulationResult; active: boolean; mitigated: boolean }) {
  const [dayIndex, setDayIndex] = useState(0);
  const selectedDay = dayLabels[dayIndex];
  const chartData =
    simulation?.strategies[0].timeline.map((point, index) => ({
      day: `+${point.day}`,
      merge: simulation.strategies[0].timeline[index].risk,
      canary: simulation.strategies[1].timeline[index].risk,
      tests: simulation.strategies[2].timeline[index].risk,
      split: simulation.strategies[3].timeline[index].risk
    })) ?? [];

  const current = simulation?.strategies.map((strategy) => strategy.timeline.find((point) => point.day === selectedDay) ?? strategy.timeline[0]) ?? [];

  return (
    <Panel className="min-h-[500px]">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Clock3 className="h-4 w-4 text-cyan-300" />
            <h2 className="font-semibold">Future Timeline</h2>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Projected outcomes across delivery time.</p>
        </div>
        <Badge>{active ? "300 futures simulated" : "Awaiting simulation"}</Badge>
      </div>

      <div className="h-56 rounded-md border border-white/10 bg-black/20 p-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
            <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} />
            <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.12)", color: "white" }} />
            <Line type="monotone" dataKey="merge" stroke="#fb7185" strokeWidth={3} dot={false} />
            <Line type="monotone" dataKey="canary" stroke="#22d3ee" strokeWidth={3} dot={false} />
            <Line type="monotone" dataKey="tests" stroke="#34d399" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="split" stroke="#f59e0b" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4">
        <input
          aria-label="Future timeline day"
          className="w-full accent-cyan-300"
          type="range"
          min={0}
          max={3}
          step={1}
          value={dayIndex}
          onChange={(event) => setDayIndex(Number(event.target.value))}
          disabled={!active}
        />
        <div className="mt-2 flex justify-between font-mono text-xs text-muted-foreground">
          <span>Now</span>
          <span>Day +1</span>
          <span>Day +7</span>
          <span>Day +30</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {simulation?.strategies.map((strategy, index) => (
          <motion.div
            key={strategy.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: active ? 1 : 0.35, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="rounded-md border border-white/10 bg-white/[0.04] p-3"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold">{strategy.name}</p>
              <span className={strategy.id === "merge_now" && !mitigated ? "text-rose-300" : "text-cyan-200"}>{current[index]?.risk ?? strategy.risk_score}</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{current[index]?.label}</p>
          </motion.div>
        ))}
      </div>
    </Panel>
  );
}

