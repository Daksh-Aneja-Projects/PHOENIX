from app.models import Decision, SimulationResult, OrbitContext, Recommendation

class DecisionEngine:
    def decide(self, sim: SimulationResult, orbit: OrbitContext) -> SimulationResult:
        # Evaluate strategies to pick the best one
        best_strategy = min(sim.strategies, key=lambda s: s.risk_score)
        
        rejected_alternatives = []
        for s in sim.strategies:
            if s.id != best_strategy.id:
                reason = "Too risky given historical incidents." if s.risk_score > best_strategy.risk_score else "Unnecessary delay for low risk context."
                rejected_alternatives.append({"strategy": s.name, "reason": reason})

        supporting_evidence = []
        if orbit.incidents:
            supporting_evidence.append(f"Avoids repeating {orbit.incidents[0]['title']}")
        if orbit.vulnerabilities:
            supporting_evidence.append(f"Mitigates exposure to {orbit.vulnerabilities[0]['title']}")
        if not supporting_evidence:
            supporting_evidence.append("Context indicates standard rollout is safe.")

        decision = Decision(
            strategy=best_strategy.name,
            confidence=best_strategy.confidence,
            expected_impact=f"Reduces incident probability to {best_strategy.incident_probability*100:.1f}%",
            supporting_evidence=supporting_evidence,
            rejected_alternatives=rejected_alternatives
        )

        # Update recommendation for backward compatibility or just overwrite it
        sim.recommendation = Recommendation(
            strategy=best_strategy.name,
            confidence=best_strategy.confidence,
            before_incident_probability=sim.strategies[0].incident_probability,
            after_incident_probability=best_strategy.incident_probability,
            before_black_swan_impact=sim.black_swan.impact,
            after_black_swan_impact="contained" if best_strategy.id != "merge_now" else sim.black_swan.impact,
            delivery_delay_days=best_strategy.delivery_delay_days
        )
        sim.decision = decision

        return sim
