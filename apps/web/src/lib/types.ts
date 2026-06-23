export type MergeRequest = {
  id: string;
  iid: number;
  title: string;
  author: string;
  branch: string;
  files_changed: number;
  pipeline_status: string;
  review_status: string;
  orbit_source: string;
};

export type Scenario = {
  merge_request: MergeRequest;
  orbit_context: {
    teams: string[];
    ownership: Array<Record<string, string>>;
    pipelines: Array<Record<string, string | number>>;
    vulnerabilities: Array<Record<string, string>>;
    incidents: Array<Record<string, string>>;
    work_items: Array<Record<string, string>>;
    objectives: Array<Record<string, string>>;
  };
};

export type Twin = {
  nodes: Array<{ id: string; label: string; type: string; risk: number; orbit: string }>;
  edges: Array<{ id: string; source: string; target: string; relationship: string; weight: number }>;
  propagation_path: string[];
  blast_radius_score: number;
};

export type SimulationResult = {
  simulation_count: number;
  strategies: Array<{
    id: string;
    name: string;
    risk_score: number;
    confidence: number;
    incident_probability: number;
    deployment_success_probability: number;
    security_exposure: number;
    delivery_delay_days: number;
    timeline: Array<{ day: number; risk: number; label: string }>;
  }>;
  clusters: Array<{ name: string; count: number; risk: number; color: string }>;
  black_swan: {
    probability: number;
    impact: string;
    title: string;
    trigger: string;
    causal_chain: string[];
    orbit_evidence: string[];
  };
  recommendation: {
    strategy: string;
    confidence: number;
    before_incident_probability: number;
    after_incident_probability: number;
    before_black_swan_impact: string;
    after_black_swan_impact: string;
    delivery_delay_days: number;
  };
  decision: {
    strategy: string;
    confidence: number;
    expected_impact: string;
    supporting_evidence: string[];
    rejected_alternatives: Array<{ strategy: string; reason: string }>;
  };
};

export type MemoryObject = {
  id: string;
  type: "incident" | "ownership" | "dependency" | "deployment" | "objective" | "work_item";
  title: string;
  relevance_score: number;
  orbit_signals: string[];
  description: string;
};

export type OrbitExplainability = {
  signals_used: string[];
  incident_memory: MemoryObject[];
  ownership_memory: MemoryObject[];
  deployment_memory: MemoryObject[];
  dependency_memory: MemoryObject[];
  objective_memory: MemoryObject[];
  readiness_score: number;
};

export type AuditLog = {
  actions: Array<{
    id: string;
    type: string;
    title: string;
    target: string;
    orbit_basis: string[];
    status: "planned" | "executed";
  }>;
  risk_before: number;
  risk_after: number;
  black_swan_before: string;
  black_swan_after: string;
};

