"use client";

import { Activity, AlertTriangle, GitMerge, Radar, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getScenario, getTwin, mitigate, runSimulation, getExplainability, ingestGitlab } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { EnterpriseTwinView } from "@/components/enterprise-twin-view";
import { EnterpriseMemoryPanel } from "@/components/enterprise-memory-panel";
import { FutureTimeline } from "@/components/future-timeline";
import { BlackSwanRadar } from "@/components/black-swan-radar";
import { OrbitMoment } from "@/components/orbit-moment";
import { BrainCircuit, Globe } from "lucide-react";

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
    <main className="min-h-screen overflow-hidden px-4 py-4 sm:px-6 lg:px-8">
      <OrbitMoment active={orbitMomentActive} complete={orbitMomentComplete} />
      <div className="mx-auto flex max-w-[1500px] flex-col gap-4">
        <header className="flex flex-col gap-4 border-b border-white/10 pb-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Badge>GitLab Orbit Future Twin</Badge>
              <Badge className="border-rose-300/20 text-rose-100">Live Demo Scenario</Badge>
              {judgeMode && <Badge className="border-emerald-300/20 text-emerald-100">Judge Mode Autoplay</Badge>}
            </div>
            <h1 className="text-3xl font-semibold tracking-normal text-white lg:text-5xl">Project Phoenix</h1>
            <p className="mt-2 max-w-3xl text-sm text-muted-foreground lg:text-base">
              The decision intelligence layer that simulates what happens next before a software decision is merged.
            </p>
          </div>
          <Panel className="min-w-[320px]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-xs uppercase text-cyan-200">Merge Request</p>
                <h2 className="mt-1 text-lg font-semibold">{mr ? `#${mr.iid} ${mr.title}` : "Loading MR #4821"}</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  {mr?.pipeline_status ?? "passing"} pipeline · {mr?.review_status ?? "approved"} review · {mr?.files_changed ?? 7} files
                </p>
              </div>
              <GitMerge className="h-6 w-6 text-cyan-300" />
            </div>
          </Panel>
        </header>

        <section className="grid gap-4 lg:grid-cols-[320px_1fr]">
          <Panel className="flex flex-col gap-4">
            <div>
              <p className="font-mono text-xs uppercase text-muted-foreground">Mission Phase</p>
              <div className="mt-2 flex items-center gap-2 text-xl font-semibold">
                <Sparkles className="h-5 w-5 text-cyan-300" />
                {phases[phase]}
              </div>
            </div>

            <div className="space-y-3">
              {phases.map((label, index) => (
                <div key={label} className="flex items-center gap-3">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      index <= phase ? "bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.9)]" : "bg-white/15"
                    }`}
                  />
                  <span className={index <= phase ? "text-sm text-white" : "text-sm text-muted-foreground"}>{label}</span>
                </div>
              ))}
            </div>

            <div className="grid gap-2">
              <Button onClick={ingestOrbit} disabled={!scenario.data || phase > 0}>
                <Activity className="h-4 w-4" />
                Ingest Orbit Context
              </Button>
              <Button onClick={simulateFutures} disabled={phase < 2 || simulation.isPending} variant="secondary">
                <Radar className="h-4 w-4" />
                Run Future Simulation
              </Button>
              <Button onClick={executeAgents} disabled={!simulation.data || agents.isPending || phase >= 5} variant="danger">
                <Zap className="h-4 w-4" />
                Execute Mitigation Agents
              </Button>
            </div>

            <AnimatePresence>
              {simulation.data && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="rounded-md border border-cyan-300/20 bg-cyan-300/8 p-3"
                >
                  <div className="flex items-center gap-2 text-sm font-semibold text-cyan-100">
                    <ShieldCheck className="h-4 w-4" />
                    Recommendation
                  </div>
                  <p className="mt-2 text-sm text-white">{simulation.data.recommendation.strategy}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Incident probability {(simulation.data.recommendation.before_incident_probability * 100).toFixed(0)}% →{" "}
                    {(simulation.data.recommendation.after_incident_probability * 100).toFixed(0)}%
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {simulation.data?.decision && phase >= 3 && (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="rounded-md border border-white/10 bg-black/40 p-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
                    <BrainCircuit className="h-4 w-4" />
                    Decision Evidence
                  </div>
                  <div className="space-y-1.5 mt-2">
                    {simulation.data.decision.supporting_evidence.map((evidence: string, idx: number) => (
                      <div key={idx} className="text-xs text-muted-foreground flex items-center gap-2">
                        <span className="h-1 w-1 rounded-full bg-cyan-400" />
                        <span dangerouslySetInnerHTML={{ __html: evidence.replace('→', '→ <strong class="text-white">').concat('</strong>') }} />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {gitlabStats && phase >= 1 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-md border border-emerald-300/25 bg-emerald-400/10 p-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-emerald-100 mb-2">
                    <Globe className="h-4 w-4" />
                    Live Context Source
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div>Project: <span className="text-white">{gitlabStats.project}</span></div>
                    <div>Contributors: <span className="text-white">{gitlabStats.contributors}</span></div>
                    <div>MR Count: <span className="text-white">{gitlabStats.mrs}</span></div>
                    <div>Issue Count: <span className="text-white">{gitlabStats.issues}</span></div>
                    <div>Pipeline Count: <span className="text-white">{gitlabStats.pipelines}</span></div>
                    <div>Risk Signals: <span className="text-white">{gitlabStats.risk_signals_generated}</span></div>
                    <div className="col-span-2 mt-1">Intelligence Score: <span className="text-emerald-300 font-bold">{gitlabStats.repository_intelligence_score}/100</span></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {phase >= 3 && orbitMomentComplete && !simulation.isPending && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="rounded-md border border-rose-300/50 bg-rose-400/20 p-4 shadow-lg shadow-rose-500/20">
                  <div className="flex items-center gap-2 text-rose-100 font-semibold mb-2">
                     <BrainCircuit className="h-5 w-5" />
                     Memory Triggered
                  </div>
                  <p className="text-sm text-white">This change resembles a deployment pattern associated with the {scenario.data?.orbit_context.incidents?.[0]?.title ?? "Session Invalidation Outage"}.</p>
                  <div className="mt-3 text-[10px] text-rose-200 flex items-center gap-1.5 font-mono uppercase">
                     Incident <GitMerge className="h-3 w-3" /> Dependency <GitMerge className="h-3 w-3" /> Ownership <GitMerge className="h-3 w-3" /> Black Swan
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {phase >= 4 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-md border border-rose-300/25 bg-rose-400/10 p-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-rose-100">
                  <AlertTriangle className="h-4 w-4" />
                  Black Swan Detected
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{((simulation.data?.black_swan?.probability ?? 0) * 100).toFixed(1)}% probability · {simulation.data?.black_swan?.impact} {scenario.data?.orbit_context?.objectives?.[0]?.title ?? "objective"} impact</p>
              </motion.div>
            )}
          </Panel>

          <div className="grid gap-4 xl:grid-cols-2">
            <EnterpriseTwinView twin={twin.data} active={phase >= 2} mitigated={phase >= 5} />
            <EnterpriseMemoryPanel explain={explain.data} />
            <div className="xl:col-span-2">
              <FutureTimeline simulation={simulation.data} active={phase >= 3} mitigated={phase >= 5} />
            </div>
            <div className="xl:col-span-2">
              <BlackSwanRadar simulation={simulation.data} audit={agents.data} active={phase >= 4} mitigated={phase >= 5} />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
