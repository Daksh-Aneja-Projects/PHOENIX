import random
from app.models import (
    FutureStrategy,
    OutcomeCluster,
    Recommendation,
    Scenario,
    SimulationResult,
    TimelinePoint,
    Twin
)
from app.causal.engine import BlackSwanEngine
from app.memory.engine import MemoryEngine
# Note: DecisionEngine will be used in services, but ContextualRiskEngine calculates the base simulation result.

class ContextualRiskEngine:
    def __init__(self):
        self.black_swan_engine = BlackSwanEngine()
        self.memory_engine = MemoryEngine()

    def simulate(self, scenario: Scenario, twin: Twin) -> SimulationResult:
        # deterministic random
        random.seed(scenario.merge_request.iid)
        
        memories = self.memory_engine.extract_memories(scenario.orbit_context)
        black_swan = self.black_swan_engine.discover(scenario.orbit_context)

        # Contextual Risk calculation
        base_risk = 10
        if any(m.type == "incident" for m in memories):
            base_risk += 30
        if any(m.type == "dependency" for m in memories):
            base_risk += 20
        if len([m for m in memories if m.type == "ownership"]) > 2:
            base_risk += 15
        if any(p.get("status") == "failed" for p in scenario.orbit_context.pipelines):
            base_risk += 25

        base_risk = min(100, base_risk)

        # Define clusters based on base risk
        clusters = [
            OutcomeCluster(name="Winning Futures", count=150 - base_risk, risk=20, color="emerald"),
            OutcomeCluster(name="Stable Futures", count=100 - (base_risk // 2), risk=40, color="cyan"),
            OutcomeCluster(name="Risk Futures", count=base_risk, risk=70, color="amber"),
            OutcomeCluster(name="Failure Futures", count=base_risk // 2, risk=90, color="red"),
            OutcomeCluster(name="Black Swan Futures", count=max(1, int(black_swan.probability * 100)), risk=100, color="rose"),
        ]
        
        sim_count = sum(c.count for c in clusters)

        strategies = [
            FutureStrategy(
                id="merge_now",
                name="Merge Now",
                risk_score=min(100, base_risk + 10),
                confidence=0.9 - (base_risk / 200),
                incident_probability=base_risk / 150,
                deployment_success_probability=1.0 - (base_risk / 200),
                security_exposure=base_risk,
                delivery_delay_days=0,
                timeline=[
                    TimelinePoint(day=1, risk=base_risk, label="Merged"),
                    TimelinePoint(day=3, risk=min(100, base_risk + 20), label="Peak Load"),
                    TimelinePoint(day=7, risk=min(100, base_risk + 5), label="Stabilized")
                ]
            ),
            FutureStrategy(
                id="canary",
                name="Canary Rollout",
                risk_score=max(10, base_risk - 30),
                confidence=0.85,
                incident_probability=base_risk / 300,
                deployment_success_probability=0.95,
                security_exposure=max(0, base_risk - 20),
                delivery_delay_days=2.0,
                timeline=[
                    TimelinePoint(day=1, risk=max(10, base_risk - 10), label="10% Traffic"),
                    TimelinePoint(day=3, risk=max(10, base_risk - 20), label="50% Traffic"),
                    TimelinePoint(day=7, risk=max(10, base_risk - 30), label="100% Traffic")
                ]
            ),
            FutureStrategy(
                id="contract_tests",
                name="Add Contract Tests",
                risk_score=max(10, base_risk - 40),
                confidence=0.95,
                incident_probability=base_risk / 400,
                deployment_success_probability=0.99,
                security_exposure=max(0, base_risk - 30),
                delivery_delay_days=3.0,
                timeline=[
                    TimelinePoint(day=1, risk=base_risk, label="Writing Tests"),
                    TimelinePoint(day=3, risk=max(10, base_risk - 20), label="Pipeline Fixes"),
                    TimelinePoint(day=7, risk=max(10, base_risk - 40), label="Safe Merge")
                ]
            ),
            FutureStrategy(
                id="agent_ops",
                name="Deploy Agent Mitigation",
                risk_score=max(5, base_risk - 50),
                confidence=0.98,
                incident_probability=base_risk / 600,
                deployment_success_probability=0.999,
                security_exposure=max(0, base_risk - 50),
                delivery_delay_days=4.0,
                timeline=[
                    TimelinePoint(day=1, risk=base_risk, label="Agent Init"),
                    TimelinePoint(day=3, risk=max(5, base_risk - 40), label="Analysis"),
                    TimelinePoint(day=7, risk=max(5, base_risk - 50), label="Protected")
                ]
            )
        ]
        
        dummy_recommendation = Recommendation(
            strategy="TBD",
            confidence=0.0,
            before_incident_probability=0.0,
            after_incident_probability=0.0,
            before_black_swan_impact="unknown",
            after_black_swan_impact="unknown",
            delivery_delay_days=0.0
        )

        from app.models import Decision
        dummy_decision = Decision(
            strategy="TBD",
            confidence=0.0,
            expected_impact="TBD",
            supporting_evidence=[],
            rejected_alternatives=[]
        )

        return SimulationResult(
            simulation_count=sim_count,
            strategies=strategies,
            clusters=clusters,
            black_swan=black_swan,
            recommendation=dummy_recommendation,
            decision=dummy_decision
        )
