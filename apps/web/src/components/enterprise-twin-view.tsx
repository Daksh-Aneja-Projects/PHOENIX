"use client";

import { Background, Controls, ReactFlow, type Edge, type Node } from "@xyflow/react";
import { motion } from "framer-motion";
import { Network } from "lucide-react";
import { useMemo } from "react";
import type { Twin } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Panel } from "@/components/ui/panel";
import { cn } from "@/lib/utils";
import { OrbitInsightPanel } from "@/components/orbit-insight-panel";
import { RiskCollapse } from "@/components/risk-collapse";

import dagre from "dagre";

function TwinNode({ data }: { data: { label: string; type: string; risk: number; orbit: string; active: boolean; mitigated: boolean } }) {
  const isHot = data.active && data.risk > 70 && !data.mitigated;
  return (
    <motion.div
      animate={{
        scale: isHot ? [1, 1.08, 1] : 1,
        boxShadow: isHot ? "0 0 34px rgba(251,113,133,0.55)" : "0 0 18px rgba(34,211,238,0.18)"
      }}
      transition={{ duration: 1.4, repeat: isHot ? Infinity : 0 }}
      className={cn(
        "w-[160px] rounded-lg border bg-slate-950/90 p-3 text-left",
        isHot ? "border-rose-300/60" : data.active ? "border-cyan-300/45" : "border-white/10",
        data.mitigated && "border-emerald-300/50"
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="truncate text-sm font-semibold text-white">{data.label}</p>
        <span className={cn("h-2 w-2 rounded-full", isHot ? "bg-rose-300" : data.mitigated ? "bg-emerald-300" : "bg-cyan-300")} />
      </div>
      <p className="mt-1 font-mono text-[10px] uppercase text-muted-foreground">{data.type}</p>
      <p className="mt-2 text-[11px] text-cyan-100">{data.orbit}</p>
    </motion.div>
  );
}

const nodeTypes = { twin: TwinNode };

export function EnterpriseTwinView({ twin, active, mitigated }: { twin?: Twin; active: boolean; mitigated: boolean }) {
  const flow = useMemo(() => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    dagreGraph.setGraph({ rankdir: 'LR', nodesep: 60, ranksep: 200 });

    twin?.nodes.forEach((node) => {
      dagreGraph.setNode(node.id, { width: 160, height: 80 });
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
            x: nodeWithPosition.x - 160 / 2,
            y: nodeWithPosition.y - 80 / 2
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
          stroke: mitigated ? "#34d399" : active && twin.propagation_path.includes(edge.source) ? "#fb7185" : undefined,
          strokeWidth: active && twin.propagation_path.includes(edge.source) ? 3 : 1.7
        }
      })) ?? [];

    return { nodes, edges };
  }, [active, mitigated, twin]);

  return (
    <Panel className="min-h-[500px] overflow-hidden">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Network className="h-4 w-4 text-cyan-300" />
            <h2 className="font-semibold">Enterprise Twin View</h2>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Orbit entities connected as a living software twin.</p>
        </div>
        <Badge>
          <span className="mr-2">Blast Radius</span>
          <RiskCollapse mitigated={mitigated} />
        </Badge>
      </div>
      <div className="h-[420px] rounded-md border border-white/10 bg-black/25">
        <ReactFlow nodes={flow.nodes} edges={flow.edges} nodeTypes={nodeTypes} fitView minZoom={0.55} maxZoom={1.25} proOptions={{ hideAttribution: true }}>
          <Background color="rgba(148,163,184,0.15)" gap={24} />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>
      <OrbitInsightPanel active={active} />
    </Panel>
  );
}
