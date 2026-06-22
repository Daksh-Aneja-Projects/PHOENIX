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
async def get_scenario() -> Scenario:
    return await scenario_service.get_scenario()


@router.get("/twin", response_model=Twin)
async def get_twin() -> Twin:
    return await twin_service.get_twin()


@router.post("/simulate", response_model=SimulationResult)
async def simulate() -> SimulationResult:
    return await simulation_service.simulate()


@router.post("/agents/mitigate", response_model=AuditLog)
async def mitigate(request: MitigationRequest) -> AuditLog:
    return await agent_service.mitigate(request)


@router.get("/audit", response_model=AuditLog)
async def audit() -> AuditLog:
    return await agent_service.audit()

