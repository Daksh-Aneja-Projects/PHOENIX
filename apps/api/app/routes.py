from fastapi import APIRouter

from app.models import AuditLog, MitigationRequest, Scenario, SimulationResult, Twin, OrbitContext, OrbitExplainability
from app.repositories import JsonFixtureRepository
from app.services import AgentService, ScenarioService, SimulationService, TwinService, MemoryService
from app.gitlab.connector import GitLabConnector
from app.gitlab.adapter import GitLabToOrbitAdapter
from pydantic import BaseModel
router = APIRouter()
repository = JsonFixtureRepository()
scenario_service = ScenarioService(repository)
twin_service = TwinService(repository)
simulation_service = SimulationService(repository)
agent_service = AgentService(repository)
memory_service = MemoryService(repository)


@router.post("/ingest")
async def ingest(orbit: OrbitContext) -> dict[str, int]:
    return await memory_service.ingest(orbit)


class IngestGitlabRequest(BaseModel):
    project_id: str


@router.post("/ingest/gitlab")
async def ingest_gitlab(req: IngestGitlabRequest) -> dict:
    connector = GitLabConnector()
    adapter = GitLabToOrbitAdapter()
    scenario = adapter.adapt(req.project_id, connector)
    
    repository.save(f"{scenario.id}.json", scenario.model_dump())
    
    intel = scenario.orbit_context.repository_intelligence or {}
    
    return {
        "context_id": scenario.id,
        "services": len(scenario.orbit_context.ownership),
        "contributors": len(connector.fetch_contributors(req.project_id)),
        "pipelines": len(scenario.orbit_context.pipelines),
        "issues": len(scenario.orbit_context.incidents) + len(scenario.orbit_context.work_items),
        "mrs": len(connector.fetch_merge_requests(req.project_id)),
        "risk_signals_generated": len(intel.keys()) - 1 if intel else 0,
        "repository_intelligence_score": intel.get("score", 100) if intel else 100
    }


@router.get("/context/{scenario_id}/explain", response_model=OrbitExplainability)
async def explain(scenario_id: str) -> OrbitExplainability:
    return await memory_service.explain(scenario_id)


@router.get("/scenario", response_model=Scenario)
async def get_scenario(scenario_id: str = "scenario_01") -> Scenario:
    return await scenario_service.get_scenario(scenario_id)


@router.get("/twin", response_model=Twin)
async def get_twin(scenario_id: str = "scenario_01") -> Twin:
    return await twin_service.get_twin(scenario_id)


@router.post("/simulate", response_model=SimulationResult)
async def simulate(scenario_id: str = "scenario_01") -> SimulationResult:
    return await simulation_service.simulate(scenario_id)


@router.post("/agents/mitigate", response_model=AuditLog)
async def mitigate(request: MitigationRequest, scenario_id: str = "scenario_01") -> AuditLog:
    return await agent_service.mitigate(request, scenario_id)


@router.get("/audit", response_model=AuditLog)
async def audit(scenario_id: str = "scenario_01") -> AuditLog:
    return await agent_service.audit(scenario_id)
