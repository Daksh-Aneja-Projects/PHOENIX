"use client";

import { Activity, GitMerge, Radar, Sparkles, Zap, ShieldCheck, AlertTriangle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getScenario, getTwin, mitigate, runSimulation, getExplainability, ingestGitlab } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EnterpriseTwinView } from "@/components/enterprise-twin-view";
import { EnterpriseMemoryPanel } from "@/components/enterprise-memory-panel";
import { FutureTimeline } from "@/components/future-timeline";
import { BlackSwanRadar } from "@/components/black-swan-radar";
import { OrbitMoment } from "@/components/orbit-moment";
import { BrainCircuit, Globe } from "lucide-react";
import { LiveIntelligencePanel } from "@/components/live-intelligence-panel";

const phases = ["Standby", "Orbit Ingested", "Twin Propagating", "Futures Simulated", "Black Swan Found", "Mitigated"];

export function PhoenixDemo() {
  const [phase, setPhase] = useState(0);
  const [orbitMomentActive, setOrbitMomentActive] = useState(false);
  const [orbitMomentComplete, setOrbitMomentComplete] = useState(false);
  const [judgeMode, setJudgeMode] = useState(false);
  const [scenarioId, setScenarioId] = useState("scenario_01");
  const [gitlabStats, setGitlabStats] = useState<{project?: string, mrs?: number, pipelines?: number, issues?: number, contributors?: number, risk_signals_generated?: number, repository_intelligence_score?: number} | null>(null);

  useEffect(() => {
    const sid = new URLSearchParams(window.location.search).get("scenario_id");
    if (sid) setScenarioId(sid);
  }, []);

  const scenario = useQuery({ queryKey: ["scenario", scenarioId], queryFn: () => getScenario(scenarioId) });
  const explain = useQuery({ queryKey: ["explain", scenarioId], queryFn: () => getExplainability(scenarioId), enabled: phase >= 1 });
  const twin = useQuery({ queryKey: ["twin", scenarioId], queryFn: () => getTwin(scenarioId), enabled: phase >= 1 });
  const simulation = useMutation({ mutationFn: () => runSimulation(scenarioId) });
  const agents = useMutation({ mutationFn: () => mitigate(scenarioId) });

  useEffect(() => {
    if (simulation.data && phase < 4) {
      const timer = window.setTimeout(() => setPhase(4), 900);
      return () => window.clearTimeout(timer);
    }
  }, [phase, simulation.data]);

  useEffect(() => {
    setJudgeMode(new URLSearchParams(window.location.search).get("judge") === "true");
  }, []);

  useEffect(() => {
    if (!judgeMode || !scenario.data) {
      return;
    }

    const timers = [
      window.setTimeout(() => ingestOrbit(), 4000),
      window.setTimeout(() => simulateFutures(), 18000),
      window.setTimeout(() => executeAgents(), 82000)
    ];

    return () => timers.forEach(window.clearTimeout);
  }, [judgeMode, scenario.data]);

  const ingestOrbit = async () => {
    setPhase(1);
    if (new URLSearchParams(window.location.search).get("source") === "gitlab") {
      try {
        const projectId = new URLSearchParams(window.location.search).get("project_id") || "278964";
        const stats = await ingestGitlab(projectId);
        setScenarioId(stats.context_id);
        setGitlabStats({
          project: projectId,
          mrs: stats.mrs,
          pipelines: stats.pipelines,
          issues: stats.issues,
          contributors: stats.contributors,
          risk_signals_generated: stats.risk_signals_generated,
          repository_intelligence_score: stats.repository_intelligence_score
        });
      } catch (e) {
        console.error("GitLab ingestion failed, falling back to scenario_01", e);
        setScenarioId("scenario_01");
      }
    }
    window.setTimeout(() => setPhase(2), 800);
  };

  const simulateFutures = () => {
    setPhase(3);
    setOrbitMomentActive(true);
    setOrbitMomentComplete(false);
    window.setTimeout(() => setOrbitMomentComplete(true), 6500);
    window.setTimeout(() => {
      setOrbitMomentActive(false);
      simulation.mutate();
    }, 7800);
  };

  const executeAgents = () => {
    agents.mutate(undefined, {
      onSuccess: () => setPhase(5)
    });
  };

  const mr = scenario.data?.merge_request;

  return (
    <main className="h-screen w-screen overflow-hidden flex flex-col bg-black text-slate-200 selection:bg-cyan-900/50">
      <OrbitMoment active={orbitMomentActive} complete={orbitMomentComplete} />
      
      {/* Permanent Intelligence Metrics Strip */}
      <header className="flex-none h-14 border-b border-white/10 bg-black/40 backdrop-blur-xl z-20 flex items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)] animate-pulse" />
            <h1 className="text-lg font-bold tracking-widest uppercase text-white">Project Phoenix</h1>
          </div>
          <div className="h-4 w-px bg-white/20" />
          {mr ? (
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-cyan-200">
              <GitMerge className="h-4 w-4" />
              <span>MR #{mr.iid}</span>
              <span className="text-muted-foreground">{mr.title}</span>
            </div>
          ) : (
            <div className="text-xs font-mono text-muted-foreground uppercase">Awaiting Target...</div>
          )}
        </div>

        <div className="flex items-center gap-6 text-xs font-mono uppercase">
          <div className="flex flex-col items-end">
            <span className="text-muted-foreground text-[9px] tracking-widest">Orbit Readiness</span>
            <span className="text-emerald-300">{explain.data?.readiness_score ?? "---"}/100</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-muted-foreground text-[9px] tracking-widest">Repo Intelligence</span>
            <span className="text-cyan-300">{gitlabStats?.repository_intelligence_score ?? "---"}/100</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-muted-foreground text-[9px] tracking-widest">Blast Radius</span>
            <span className="text-rose-300">{twin.data?.blast_radius_score ?? "---"}/100</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-muted-foreground text-[9px] tracking-widest">Black Swan Risk</span>
            <span className={simulation.data ? "text-rose-400 font-bold" : "text-slate-400"}>
              {simulation.data ? `${(simulation.data.black_swan.probability * 100).toFixed(1)}%` : "PENDING"}
            </span>
          </div>
          <div className="flex flex-col items-end border-l border-white/10 pl-6">
            <span className="text-muted-foreground text-[9px] tracking-widest">System Status</span>
            <span className={phase >= 4 ? "text-emerald-400" : "text-cyan-400"}>{phases[phase]}</span>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left/Center Column - The Product Surface */}
        <div className="flex-1 flex flex-col min-w-0 relative bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900/20 via-black to-black">
          
          {/* Top Control Bar overlaying Twin */}
          <div className="absolute top-4 left-4 z-10 flex gap-2">
            <Button onClick={ingestOrbit} disabled={!scenario.data || phase > 0} className="bg-black/50 backdrop-blur-md border border-cyan-500/30 hover:bg-cyan-900/30">
              <Activity className="h-4 w-4 mr-2" />
              Ingest Context
            </Button>
            <Button onClick={simulateFutures} disabled={phase < 2 || simulation.isPending} variant="secondary" className="bg-black/50 backdrop-blur-md border border-amber-500/30 hover:bg-amber-900/30">
              <Radar className="h-4 w-4 mr-2 text-amber-400" />
              Simulate
            </Button>
            <Button onClick={executeAgents} disabled={!simulation.data || agents.isPending || phase >= 5} variant="danger" className="bg-black/50 backdrop-blur-md border border-rose-500/30 hover:bg-rose-900/30">
              <Zap className="h-4 w-4 mr-2 text-rose-400" />
              Mitigate
            </Button>
          </div>

          {/* SOFTWARE FUTURE TWIN - The core product */}
          <div className="flex-1 relative overflow-hidden">
             <EnterpriseTwinView twin={twin.data} active={phase >= 2} mitigated={phase >= 5} />
          </div>

          {/* FUTURE TIMELINE - Diverging visualizer */}
          <div className="h-[280px] flex-none border-t border-white/10 bg-black/60 backdrop-blur-xl relative z-20">
             <FutureTimeline simulation={simulation.data} active={phase >= 3} mitigated={phase >= 5} />
          </div>
        </div>

        {/* Right Sidebar - Operational Intelligence */}
        <div className="w-[480px] flex-none flex flex-col border-l border-white/10 bg-black/80 backdrop-blur-2xl overflow-y-auto z-20 shadow-[-20px_0_40px_rgba(0,0,0,0.5)]">
          <div className="flex-1 p-4 flex flex-col gap-6">
            
            {/* Context Stats Block */}
            {gitlabStats && phase >= 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-lg border border-emerald-500/20 bg-emerald-900/10 p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-3">
                  <Globe className="h-4 w-4" />
                  Live Context Source
                </div>
                <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs text-muted-foreground font-mono">
                  <div>Project: <span className="text-white">{gitlabStats.project}</span></div>
                  <div>Contributors: <span className="text-white">{gitlabStats.contributors}</span></div>
                  <div>MR Count: <span className="text-white">{gitlabStats.mrs}</span></div>
                  <div>Issues: <span className="text-white">{gitlabStats.issues}</span></div>
                </div>
              </motion.div>
            )}

            {/* Black Swan Discovery (Massive dramatic visual) */}
            <BlackSwanRadar simulation={simulation.data} active={phase >= 4} mitigated={phase >= 5} />

            {/* Enterprise Memory */}
            <EnterpriseMemoryPanel explain={explain.data} active={phase >= 1} />

            {/* Decision & Agent Feed */}
            <LiveIntelligencePanel simulation={simulation.data} audit={agents.data} active={phase >= 3} mitigated={phase >= 5} />

          </div>
        </div>
      </div>
    </main>
  );
}
