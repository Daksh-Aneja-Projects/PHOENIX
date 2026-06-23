from typing import Literal

from pydantic import BaseModel, Field


class MergeRequest(BaseModel):
    id: str
    iid: int
    title: str
    author: str
    branch: str
    files_changed: int
    pipeline_status: str
    review_status: str
    orbit_source: str


class OrbitContext(BaseModel):
    teams: list[str]
    ownership: list[dict[str, str]]
    pipelines: list[dict[str, str | int]]
    vulnerabilities: list[dict[str, str]]
    incidents: list[dict[str, str]]
    work_items: list[dict[str, str]]
    objectives: list[dict[str, str]]
    repository_intelligence: dict = Field(default_factory=dict)


class Scenario(BaseModel):
    id: str
    name: str
    merge_request: MergeRequest
    orbit_context: OrbitContext


class TwinNode(BaseModel):
    id: str
    label: str
    type: Literal["merge_request", "service", "objective", "team", "vulnerability", "incident"]
    risk: int = Field(ge=0, le=100)
    orbit: str


class TwinEdge(BaseModel):
    id: str
    source: str
    target: str
    relationship: str
    weight: float = Field(ge=0, le=1)


class Twin(BaseModel):
    nodes: list[TwinNode]
    edges: list[TwinEdge]
    propagation_path: list[str]
    blast_radius_score: int = Field(ge=0, le=100)


class TimelinePoint(BaseModel):
    day: int
    risk: int = Field(ge=0, le=100)
    label: str


class FutureStrategy(BaseModel):
    id: str
    name: str
    risk_score: int
    confidence: float
    incident_probability: float
    deployment_success_probability: float
    security_exposure: int
    delivery_delay_days: float
    timeline: list[TimelinePoint]


class OutcomeCluster(BaseModel):
    name: str
    count: int
    risk: int
    color: str


class BlackSwan(BaseModel):
    probability: float
    impact: str
    title: str
    trigger: str
    causal_chain: list[str]
    orbit_evidence: list[str]


class Recommendation(BaseModel):
    strategy: str
    confidence: float
    before_incident_probability: float
    after_incident_probability: float
    before_black_swan_impact: str
    after_black_swan_impact: str
    delivery_delay_days: float


class Decision(BaseModel):
    strategy: str
    confidence: float
    expected_impact: str
    supporting_evidence: list[str]
    rejected_alternatives: list[dict[str, str]]


class SimulationResult(BaseModel):
    simulation_count: int
    strategies: list[FutureStrategy]
    clusters: list[OutcomeCluster]
    black_swan: BlackSwan
    recommendation: Recommendation
    decision: Decision


class MemoryObject(BaseModel):
    id: str
    type: Literal["incident", "ownership", "dependency", "deployment", "objective", "work_item"]
    title: str
    relevance_score: float
    orbit_signals: list[str]
    description: str


class OrbitExplainability(BaseModel):
    signals_used: list[str]
    incident_memory: list[MemoryObject]
    ownership_memory: list[MemoryObject]
    deployment_memory: list[MemoryObject]
    dependency_memory: list[MemoryObject]
    objective_memory: list[MemoryObject]
    readiness_score: int


class MitigationRequest(BaseModel):
    mr_id: str = "4821"
    strategy: str = "Canary + Contract Validation + Security Review"


class AgentAction(BaseModel):
    id: str
    type: str
    title: str
    target: str
    orbit_basis: list[str]
    status: Literal["planned", "executed"] = "planned"


class AuditLog(BaseModel):
    actions: list[AgentAction]
    risk_before: int
    risk_after: int
    black_swan_before: str
    black_swan_after: str

