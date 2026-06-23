import { BrainCircuit } from "lucide-react";
import { Panel } from "@/components/ui/panel";
import type { OrbitExplainability } from "@/lib/types";

export function EnterpriseMemoryPanel({ explain }: { explain?: OrbitExplainability }) {
  if (!explain) return null;

  return (
    <Panel className="flex flex-col gap-4 min-h-[420px]">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-emerald-300" />
          <h2 className="font-semibold text-lg">Enterprise Memory</h2>
        </div>
        <div className="text-xs font-mono border border-emerald-300/30 text-emerald-200 bg-emerald-400/10 px-2 py-1 rounded">
          Readiness: {explain.readiness_score}/100
        </div>
      </div>
      
      <div className="space-y-4 overflow-y-auto">
        {explain.incident_memory.length > 0 && (
          <div>
            <h3 className="text-xs font-mono text-muted-foreground uppercase mb-2">Historical Incidents</h3>
            {explain.incident_memory.map(m => (
              <div key={m.id} className="text-sm bg-black/20 border border-white/5 rounded p-3 mb-2">
                <span className="font-semibold text-rose-200">{m.title}</span>
                <p className="text-xs text-muted-foreground mt-1">{m.description}</p>
              </div>
            ))}
          </div>
        )}
        
        {explain.ownership_memory.length > 0 && (
          <div>
            <h3 className="text-xs font-mono text-muted-foreground uppercase mb-2">Ownership Knowledge</h3>
            {explain.ownership_memory.slice(0, 3).map(m => (
              <div key={m.id} className="text-sm bg-black/20 border border-white/5 rounded p-3 mb-2">
                <span className="font-semibold text-cyan-200">{m.title}</span>
                <p className="text-xs text-muted-foreground mt-1">{m.description}</p>
              </div>
            ))}
          </div>
        )}
        
        {explain.dependency_memory.length > 0 && (
          <div>
            <h3 className="text-xs font-mono text-muted-foreground uppercase mb-2">Dependency Memory</h3>
            {explain.dependency_memory.map(m => (
              <div key={m.id} className="text-sm bg-black/20 border border-white/5 rounded p-3 mb-2">
                <span className="font-semibold text-amber-200">{m.title}</span>
                <p className="text-xs text-muted-foreground mt-1">{m.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Panel>
  );
}
