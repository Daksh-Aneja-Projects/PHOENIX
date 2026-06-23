from fastapi import APIRouter

from app.models import AuditLog, MitigationRequest, Scenario, SimulationResult, Twin
from app.repositories import JsonFixtureRepository
from app.services import AgentService, ScenarioService, SimulationService, TwinService

router = APIRouter()
repository = JsonFixtureRepository()
scenario_service = ScenarioService(repository)
twin_service = TwinService(repository)
simulation_service = SimulationService(repository)
agent_service = AgentService(repository)


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
