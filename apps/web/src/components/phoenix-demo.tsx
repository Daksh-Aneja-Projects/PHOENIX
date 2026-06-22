"use client";

import { Activity, AlertTriangle, GitMerge, Radar, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getScenario, getTwin, mitigate, runSimulation } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { EnterpriseTwinView } from "@/components/enterprise-twin-view";
import { FutureTimeline } from "@/components/future-timeline";
import { BlackSwanRadar } from "@/components/black-swan-radar";
import { OrbitMoment } from "@/components/orbit-moment";

const phases = ["Standby", "Orbit Ingested", "Twin Propagating", "Futures Simulated", "Black Swan Found", "Mitigated"];

export function PhoenixDemo() {
  const [phase, setPhase] = useState(0);
  const [orbitMomentActive, setOrbitMomentActive] = useState(false);
  const [orbitMomentComplete, setOrbitMomentComplete] = useState(false);
  const [judgeMode, setJudgeMode] = useState(false);
  const scenario = useQuery({ queryKey: ["scenario"], queryFn: getScenario });
  const twin = useQuery({ queryKey: ["twin"], queryFn: getTwin, enabled: phase >= 1 });
  const simulation = useMutation({ mutationFn: runSimulation });
  const agents = useMutation({ mutationFn: mitigate });

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

  const ingestOrbit = () => {
    setPhase(1);
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

            {phase >= 4 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-md border border-rose-300/25 bg-rose-400/10 p-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-rose-100">
                  <AlertTriangle className="h-4 w-4" />
                  Black Swan Detected
                </div>
                <p className="mt-2 text-xs text-muted-foreground">4.8% probability · critical enterprise SSO impact</p>
              </motion.div>
            )}
          </Panel>

          <div className="grid gap-4 xl:grid-cols-2">
            <EnterpriseTwinView twin={twin.data} active={phase >= 2} mitigated={phase >= 5} />
            <FutureTimeline simulation={simulation.data} active={phase >= 3} mitigated={phase >= 5} />
            <div className="xl:col-span-2">
              <BlackSwanRadar simulation={simulation.data} audit={agents.data} active={phase >= 4} mitigated={phase >= 5} />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
