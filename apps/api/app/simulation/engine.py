import random
from app.models import Scenario, Twin, SimulationResult, FutureStrategy, TimelinePoint, OutcomeCluster, Recommendation
from app.causal.engine import CausalEngine

class SimulationEngine:
    def __init__(self):
        self.causal_engine = CausalEngine()

    def simulate(self, scenario: Scenario, twin: Twin) -> SimulationResult:
        random.seed(scenario.merge_request.id)  # Deterministic per MR
        
        num_simulations = random.randint(150, 250)
        
        base_risk = 40
        if scenario.orbit_context.vulnerabilities:
            base_risk += 30
        if scenario.orbit_context.incidents:
            base_risk += 20
            
        black_swan = self.causal_engine.explain_black_swan(scenario, twin)
        causal_rec = self.causal_engine.explain_recommendation(scenario)
        
        # Strategies
        strategies = [
            FutureStrategy(
                id="merge_now",
                name="Merge Now",
                risk_score=min(base_risk + 10, 100),
                confidence=0.6,
                incident_probability=black_swan.probability + 0.2,
                deployment_success_probability=0.7,
                security_exposure=base_risk,
                delivery_delay_days=0,
                timeline=[
                    TimelinePoint(day=0, risk=base_risk, label="pipeline passes"),
                    TimelinePoint(day=7, risk=min(base_risk + 15, 100), label="vulnerability found"),
                    TimelinePoint(day=30, risk=min(base_risk + 30, 100), label="incident triggered")
                ]
            ),
            FutureStrategy(
                id="canary",
                name="Canary",
                risk_score=max(base_risk - 20, 10),
                confidence=0.8,
                incident_probability=black_swan.probability,
                deployment_success_probability=0.9,
                security_exposure=max(base_risk - 10, 10),
                delivery_delay_days=2,
                timeline=[
                    TimelinePoint(day=0, risk=base_risk, label="pipeline passes"),
                    TimelinePoint(day=7, risk=max(base_risk - 10, 10), label="canary stable"),
                    TimelinePoint(day=30, risk=max(base_risk - 20, 10), label="full rollout")
                ]
            ),
            FutureStrategy(
                id="contract_tests",
                name="Add Contract Tests",
                risk_score=max(base_risk - 15, 10),
                confidence=0.85,
                incident_probability=black_swan.probability + 0.05,
                deployment_success_probability=0.85,
                security_exposure=base_risk,
                delivery_delay_days=3,
                timeline=[
                    TimelinePoint(day=0, risk=base_risk, label="tests added"),
                    TimelinePoint(day=7, risk=max(base_risk - 15, 10), label="compatibility verified"),
                    TimelinePoint(day=30, risk=max(base_risk - 15, 10), label="launch stable")
                ]
            )
        ]
        
        # Recommendation
        best_strategy = min(strategies, key=lambda s: s.risk_score)
        
        # Strategy text dynamic based on causal engine
        rec_text = best_strategy.name
        if causal_rec["reasoning"]:
            rec_text += f" (Due to: {', '.join(causal_rec['reasoning'])})"
            
        recommendation = Recommendation(
            strategy=rec_text,
            confidence=causal_rec["confidence"],
            before_incident_probability=strategies[0].incident_probability,
            after_incident_probability=best_strategy.incident_probability,
            before_black_swan_impact=black_swan.impact,
            after_black_swan_impact="contained" if best_strategy.id != "merge_now" else black_swan.impact,
            delivery_delay_days=best_strategy.delivery_delay_days
        )
        
        clusters = [
            OutcomeCluster(name="Winning Futures", count=int(num_simulations * 0.4), risk=20, color="emerald"),
            OutcomeCluster(name="Stable Futures", count=int(num_simulations * 0.3), risk=40, color="cyan"),
            OutcomeCluster(name="Risk Futures", count=int(num_simulations * 0.2), risk=70, color="amber"),
            OutcomeCluster(name="Failure Futures", count=int(num_simulations * 0.08), risk=90, color="red"),
            OutcomeCluster(name="Black Swan Futures", count=int(num_simulations * 0.02), risk=100, color="rose")
        ]

        return SimulationResult(
            simulation_count=num_simulations,
            strategies=strategies,
            clusters=clusters,
            black_swan=black_swan,
            recommendation=recommendation
        )
