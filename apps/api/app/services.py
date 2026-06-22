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


class ScenarioService:
    def __init__(self, repository: JsonFixtureRepository) -> None:
        self.repository = repository

    async def get_scenario(self) -> Scenario:
        return Scenario.model_validate(self.repository.load("scenario.json"))


class TwinService:
    def __init__(self, repository: JsonFixtureRepository) -> None:
        self.repository = repository

    async def get_twin(self) -> Twin:
        return Twin.model_validate(self.repository.load("twin.json"))


class SimulationService:
    def __init__(self, repository: JsonFixtureRepository) -> None:
        self.repository = repository

    async def simulate(self) -> SimulationResult:
        payload = deepcopy(self.repository.load("simulation.json"))
        payload["simulation_count"] = sum(cluster["count"] for cluster in payload["clusters"])
        return SimulationResult.model_validate(payload)


class AgentService:
    def __init__(self, repository: JsonFixtureRepository) -> None:
        self.repository = repository
        self._audit: AuditLog | None = None

    async def mitigate(self, request: MitigationRequest) -> AuditLog:
        actions = [
            AgentAction.model_validate({**action, "status": "executed"})
            for action in self.repository.load("actions.json")
        ]
        self._audit = AuditLog(
            actions=actions,
            risk_before=84,
            risk_after=38,
            black_swan_before="critical",
            black_swan_after="contained",
        )
        return self._audit

    async def audit(self) -> AuditLog:
        if self._audit is None:
            actions = [
                AgentAction.model_validate(action)
                for action in self.repository.load("actions.json")
            ]
            self._audit = AuditLog(
                actions=actions,
                risk_before=84,
                risk_after=84,
                black_swan_before="critical",
                black_swan_after="critical",
            )
        return self._audit

