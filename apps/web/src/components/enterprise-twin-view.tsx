"use client";

import { Background, Controls, ReactFlow, type Edge, type Node } from "@xyflow/react";
import { motion } from "framer-motion";
import { useMemo } from "react";
import type { Twin } from "@/lib/types";
import { cn } from "@/lib/utils";
import { OrbitInsightPanel } from "@/components/orbit-insight-panel";

import dagre from "dagre";

function TwinNode({ data }: { data: { label: string; type: string; risk: number; orbit: string; active: boolean; mitigated: boolean } }) {
  const isHot = data.active && data.risk > 70 && !data.mitigated;
  return (
    <motion.div
      animate={{
        scale: isHot ? [1, 1.05, 1] : 1,
        boxShadow: isHot ? "0 0 40px rgba(251,113,133,0.4)" : "0 0 20px rgba(34,211,238,0.1)"
      }}
      transition={{ duration: 1.4, repeat: isHot ? Infinity : 0 }}
      className={cn(
        "w-[180px] rounded-lg border backdrop-blur-md p-4 text-left transition-colors duration-500",
        isHot ? "border-rose-400/80 bg-rose-950/40" : data.active ? "border-cyan-400/40 bg-cyan-950/20" : "border-white/10 bg-black/40",
        data.mitigated && "border-emerald-400/50 bg-emerald-950/30"
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="truncate text-sm font-bold text-white drop-shadow-md">{data.label}</p>
        <span className={cn("h-2 w-2 rounded-full", isHot ? "bg-rose-400 animate-pulse shadow-[0_0_8px_rgba(251,113,133,0.8)]" : data.mitigated ? "bg-emerald-400" : "bg-cyan-400 opacity-50")} />
      </div>
      <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-slate-400">{data.type}</p>
      {data.active && (
        <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-widest text-slate-500">Orbit</span>
          <span className="text-[11px] font-mono text-cyan-200">{data.orbit}</span>
        </div>
      )}
    </motion.div>
  );
}

const nodeTypes = { twin: TwinNode };

export function EnterpriseTwinView({ twin, active, mitigated }: { twin?: Twin; active: boolean; mitigated: boolean }) {
  const flow = useMemo(() => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    dagreGraph.setGraph({ rankdir: 'LR', nodesep: 80, ranksep: 250 });

    twin?.nodes.forEach((node) => {
      dagreGraph.setNode(node.id, { width: 180, height: 100 });
    });

    twin?.edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const nodes: Node[] =
      twin?.nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        return {
          id: node.id,
          type: "twin",
          position: {
            x: nodeWithPosition.x - 180 / 2,
            y: nodeWithPosition.y - 100 / 2
          },
          data: { ...node, active, mitigated }
        };
      }) ?? [];

    const edges: Edge[] =
      twin?.edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        animated: active && (twin.propagation_path.includes(edge.source) || twin.propagation_path.includes(edge.target)),
        className: cn(
          active && twin.propagation_path.includes(edge.source) && "risk-edge",
          mitigated && twin.propagation_path.includes(edge.source) && "mitigated-edge"
        ),
        label: edge.relationship,
        style: {
          stroke: mitigated ? "#34d399" : active && twin.propagation_path.includes(edge.source) ? "#fb7185" : "rgba(255,255,255,0.1)",
          strokeWidth: active && twin.propagation_path.includes(edge.source) ? 3 : 1.5,
          opacity: active ? 1 : 0.4
        }
      })) ?? [];

    return { nodes, edges };
  }, [active, mitigated, twin]);

  return (
    <div className="absolute inset-0 h-full w-full">
      <ReactFlow nodes={flow.nodes} edges={flow.edges} nodeTypes={nodeTypes} fitView minZoom={0.3} maxZoom={1.5} proOptions={{ hideAttribution: true }}>
        <Background color="rgba(34,211,238,0.05)" gap={32} size={1} />
        <Controls showInteractive={false} className="opacity-50 hover:opacity-100 transition-opacity" />
      </ReactFlow>
      <OrbitInsightPanel active={active} />
    </div>
  );
}
