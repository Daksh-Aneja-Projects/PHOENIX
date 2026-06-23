from copy import deepcopy

from app.models import (
    AgentAction,
    AuditLog,
    MitigationRequest,
    Scenario,
    SimulationResult,
    Twin,
)
from app.repositories import JsonFixtureRepository
from app.twin.engine import TwinEngine
from app.simulation.engine import SimulationEngine
from app.agents.planner import AgentPlanner


class ScenarioService:
    def __init__(self, repository: JsonFixtureRepository) -> None:
        self.repository = repository

    async def get_scenario(self, scenario_id: str) -> Scenario:
        return Scenario.model_validate(self.repository.load(f"{scenario_id}.json"))


class TwinService:
    def __init__(self, repository: JsonFixtureRepository) -> None:
        self.repository = repository
        self.engine = TwinEngine()

    async def get_twin(self, scenario_id: str) -> Twin:
        scenario = Scenario.model_validate(self.repository.load(f"{scenario_id}.json"))
        return self.engine.generate(scenario)


class SimulationService:
    def __init__(self, repository: JsonFixtureRepository) -> None:
        self.repository = repository
        self.engine = SimulationEngine()
        self.twin_engine = TwinEngine()

    async def simulate(self, scenario_id: str) -> SimulationResult:
        scenario = Scenario.model_validate(self.repository.load(f"{scenario_id}.json"))
        twin = self.twin_engine.generate(scenario)
        return self.engine.simulate(scenario, twin)


class AgentService:
    def __init__(self, repository: JsonFixtureRepository) -> None:
        self.repository = repository
        self.planner = AgentPlanner()
        self.simulation_engine = SimulationEngine()
        self.twin_engine = TwinEngine()
        self._audit: dict[str, AuditLog] = {}

    async def mitigate(self, request: MitigationRequest, scenario_id: str) -> AuditLog:
        scenario = Scenario.model_validate(self.repository.load(f"{scenario_id}.json"))
        twin = self.twin_engine.generate(scenario)
        sim = self.simulation_engine.simulate(scenario, twin)
        
        actions = self.planner.generate_actions(sim, scenario)
        
        best_strategy = min(sim.strategies, key=lambda s: s.risk_score)
        
        audit = AuditLog(
            actions=actions,
            risk_before=sim.strategies[0].risk_score,
            risk_after=best_strategy.risk_score,
            black_swan_before=sim.black_swan.impact,
            black_swan_after=sim.recommendation.after_black_swan_impact,
        )
        self._audit[scenario_id] = audit
        return audit

    async def audit(self, scenario_id: str) -> AuditLog:
        return self._audit.get(scenario_id, AuditLog(actions=[], risk_before=0, risk_after=0, black_swan_before="", black_swan_after=""))
