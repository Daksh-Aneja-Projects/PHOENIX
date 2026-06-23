from app.models import Scenario, Twin, BlackSwan

class CausalEngine:
    def explain_black_swan(self, scenario: Scenario, twin: Twin) -> BlackSwan:
        vulns = scenario.orbit_context.vulnerabilities
        incs = scenario.orbit_context.incidents
        
        # Build causal chain
        chain = [
            f"MR #{scenario.merge_request.iid} modifies code",
        ]
        
        trigger = "Unforeseen interactions"
        impact = "moderate"
        prob = 0.02
        evidence = ["Merge Request"]
        title = "Unexpected system behavior"
        
        if vulns:
            v = vulns[0]
            chain.append(f"{v['service']} inherits {v['title']}")
            trigger = f"Exploitation of {v['title']}"
            prob += 0.05
            impact = "high"
            evidence.append("Vulnerability")
            title = f"{v['service']} compromise via {v['title']}"
            
        if incs:
            i = incs[0]
            chain.append(f"Similar conditions to {i['title']} emerge")
            trigger += f" + {i['title']} recurrence"
            prob += 0.03
            impact = "critical"
            evidence.append("Incident history")
            title = f"Cascading failure mirroring {i['title']}"
            
        if scenario.orbit_context.objectives:
            obj = scenario.orbit_context.objectives[0]
            chain.append(f"Objective '{obj['title']}' fails")
            evidence.append("Objective")
            
        return BlackSwan(
            probability=min(prob, 0.99),
            impact=impact,
            title=title,
            trigger=trigger,
            causal_chain=chain,
            orbit_evidence=evidence
        )

    def explain_recommendation(self, scenario: Scenario) -> dict:
        # returns text explanations to be used by SimulationEngine
        reasoning = []
        if len(scenario.orbit_context.vulnerabilities) > 0:
            reasoning.append("High vulnerability exposure detected.")
        if len(scenario.orbit_context.incidents) > 0:
            reasoning.append("Historical incident correlation found.")
            
        return {
            "confidence": 0.85 if not reasoning else 0.72,
            "reasoning": reasoning
        }
