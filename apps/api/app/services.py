from copy import deepcopy

from app.models import (
    AgentAction,
    AuditLog,
    MitigationRequest,
    Scenario,
    SimulationResult,
    Twin,
    OrbitContext,
    OrbitExplainability
)
from app.repositories import JsonFixtureRepository
from app.twin.engine import FutureTwinGenerator
from app.simulation.engine import ContextualRiskEngine
from app.agents.planner import AgentPlanner
from app.memory.engine import MemoryEngine
from app.decision.engine import DecisionEngine


class ScenarioService:
    def __init__(self, repository: JsonFixtureRepository) -> None:
        self.repository = repository

    async def get_scenario(self, scenario_id: str) -> Scenario:
        return Scenario.model_validate(self.repository.load(f"{scenario_id}.json"))


class TwinService:
    def __init__(self, repository: JsonFixtureRepository) -> None:
        self.repository = repository
        self.engine = FutureTwinGenerator()

    async def get_twin(self, scenario_id: str) -> Twin:
        scenario = Scenario.model_validate(self.repository.load(f"{scenario_id}.json"))
        return self.engine.generate(scenario)


class SimulationService:
    def __init__(self, repository: JsonFixtureRepository) -> None:
        self.repository = repository
        self.engine = ContextualRiskEngine()
        self.twin_engine = FutureTwinGenerator()
        self.decision_engine = DecisionEngine()

    async def simulate(self, scenario_id: str) -> SimulationResult:
        scenario = Scenario.model_validate(self.repository.load(f"{scenario_id}.json"))
        twin = self.twin_engine.generate(scenario)
        sim = self.engine.simulate(scenario, twin)
        sim = self.decision_engine.decide(sim, scenario.orbit_context)
        return sim


class AgentService:
    def __init__(self, repository: JsonFixtureRepository) -> None:
        self.repository = repository
        self.planner = AgentPlanner()
        self.simulation_engine = ContextualRiskEngine()
        self.twin_engine = FutureTwinGenerator()
        self.decision_engine = DecisionEngine()
        self._audit: dict[str, AuditLog] = {}

    async def mitigate(self, request: MitigationRequest, scenario_id: str) -> AuditLog:
        scenario = Scenario.model_validate(self.repository.load(f"{scenario_id}.json"))
        twin = self.twin_engine.generate(scenario)
        sim = self.simulation_engine.simulate(scenario, twin)
        sim = self.decision_engine.decide(sim, scenario.orbit_context)
        
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


class MemoryService:
    def __init__(self, repository: JsonFixtureRepository) -> None:
        self.repository = repository
        self.engine = MemoryEngine()

    async def ingest(self, orbit: OrbitContext) -> dict[str, int]:
        score = self.engine.get_readiness_score(orbit)
        return {"readiness_score": score}

    async def explain(self, scenario_id: str) -> OrbitExplainability:
        scenario = Scenario.model_validate(self.repository.load(f"{scenario_id}.json"))
        memories = self.engine.extract_memories(scenario.orbit_context)
        
        return OrbitExplainability(
            signals_used=["Historical Incidents", "Vulnerability History", "Ownership Patterns"],
            incident_memory=[m for m in memories if m.type == "incident"],
            ownership_memory=[m for m in memories if m.type == "ownership"],
            deployment_memory=[m for m in memories if m.type == "deployment"],
            dependency_memory=[m for m in memories if m.type == "dependency"],
            objective_memory=[m for m in memories if m.type == "objective"],
            readiness_score=self.engine.get_readiness_score(scenario.orbit_context)
        )
