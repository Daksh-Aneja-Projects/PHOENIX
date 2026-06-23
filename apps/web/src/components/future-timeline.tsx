"use client";

import { motion } from "framer-motion";
import { Clock3, GitMerge, ShieldCheck, Zap } from "lucide-react";
import type { SimulationResult } from "@/lib/types";

export function FutureTimeline({ simulation, active, mitigated }: { simulation?: SimulationResult; active: boolean; mitigated: boolean }) {
  if (!simulation) {
    return (
      <div className="h-full flex flex-col justify-center items-center opacity-70">
        <Clock3 className="h-8 w-8 text-cyan-400 mb-4 animate-pulse" />
        <p className="font-mono text-sm uppercase tracking-widest text-cyan-100">Awaiting Simulation</p>
      </div>
    );
  }

  const days = [0, 1, 7, 30];
  const xCoords = [20, 200, 450, 750]; // mapping days to X pixels
  const strategies = simulation.strategies;
  
  // Distribute Y coordinates for branches
  const yCenter = 120;
  const ySpread = 160; 
  const getY = (index: number, max: number) => {
    if (max === 1) return yCenter;
    return yCenter - ySpread/2 + (ySpread / (max - 1)) * index;
  };

  return (
    <div className="h-full flex flex-col p-6 relative">
      <div className="flex items-center gap-2 mb-2 absolute top-4 left-6 z-20">
        <Clock3 className="h-4 w-4 text-cyan-400" />
        <h2 className="font-semibold text-sm uppercase tracking-wider text-cyan-50">Future Divergence Tree</h2>
      </div>

      <div className="flex-1 relative w-full h-full mt-6">
        {/* Axis Labels */}
        {days.map((day, idx) => (
          <div key={day} className="absolute bottom-0 text-[10px] font-mono text-slate-500 uppercase -translate-x-1/2" style={{ left: `${xCoords[idx]}px` }}>
            Day {day === 0 ? "Now" : `+${day}`}
          </div>
        ))}

        {/* SVG Drawing Canvas */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 850 240" preserveAspectRatio="xMinYMid slice">
          {active && strategies.map((strategy, sIdx) => {
            const startY = yCenter;
            const endY = getY(sIdx, strategies.length);
            const isMergeNow = strategy.id === "merge_now";
            const isHot = isMergeNow && !mitigated;
            const color = isHot ? "#fb7185" : "#22d3ee"; // rose-400 or cyan-400
            const strokeOpacity = isHot ? 0.8 : 0.3;

            // Generate bezier curve path
            const pathData = `M ${xCoords[0]} ${startY} C ${xCoords[1]} ${startY}, ${xCoords[1]} ${endY}, ${xCoords[2]} ${endY} L ${xCoords[3]} ${endY}`;

            return (
              <g key={strategy.id}>
                {/* Branch Path */}
                <motion.path
                  d={pathData}
                  fill="none"
                  stroke={color}
                  strokeWidth={isHot ? 3 : 1.5}
                  strokeOpacity={strokeOpacity}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: sIdx * 0.2 }}
                  style={{ filter: isHot ? "drop-shadow(0 0 8px rgba(244,63,94,0.8))" : "none" }}
                />
              </g>
            );
          })}
        </svg>

        {/* Nodes overlay (HTML for tooltips and hover effects) */}
        {active && strategies.map((strategy, sIdx) => {
          const endY = getY(sIdx, strategies.length);
          const isMergeNow = strategy.id === "merge_now";
          const isHot = isMergeNow && !mitigated;
          
          return (
            <div key={`nodes-${strategy.id}`} className="absolute inset-0 pointer-events-none">
              {/* Endpoint Strategy Label */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.5 + sIdx * 0.2 }}
                className="absolute text-xs whitespace-nowrap -translate-y-1/2 pointer-events-auto cursor-help"
                style={{ left: `${xCoords[3] + 15}px`, top: `${endY}px` }}
              >
                <div className={`font-semibold uppercase tracking-wider ${isHot ? "text-rose-400" : "text-cyan-300"}`}>
                  {strategy.name}
                </div>
                <div className="text-[9px] font-mono text-slate-500">
                  Risk: {strategy.risk_score} | Conf: {(strategy.confidence*100).toFixed(0)}%
                </div>
              </motion.div>

              {/* Day Nodes */}
              {strategy.timeline.map((point, pIdx) => {
                const px = xCoords[pIdx];
                const py = pIdx < 2 ? yCenter + (endY - yCenter) * (pIdx/2) : endY; // Approximate position on curve
                const pointRiskHigh = point.risk >= 70;
                const pColor = pointRiskHigh && (!mitigated || isMergeNow) ? "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]" : "bg-cyan-500";

                return (
                  <motion.div
                    key={`${strategy.id}-${point.day}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: pIdx * 0.4 + sIdx * 0.1 }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto group"
                    style={{ left: `${px}px`, top: `${py}px` }}
                  >
                    <div className={`h-2.5 w-2.5 rounded-full ${pColor} group-hover:scale-150 transition-transform cursor-crosshair`} />
                    
                    {/* Tooltip */}
                    <div className="absolute top-4 opacity-0 group-hover:opacity-100 transition-opacity bg-black/90 border border-white/20 p-2 rounded text-[10px] w-40 -translate-x-1/2 left-1/2 z-50 pointer-events-none shadow-2xl">
                      <div className="text-white font-semibold mb-1">Risk: {point.risk}</div>
                      <div className="text-muted-foreground leading-tight">{point.label}</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
