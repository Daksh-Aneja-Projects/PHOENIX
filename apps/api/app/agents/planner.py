import uuid
from app.models import SimulationResult, Scenario, AgentAction

class AgentPlanner:
    def generate_actions(self, simulation: SimulationResult, scenario: Scenario) -> list[AgentAction]:
        actions = []
        
        # Check security risk
        if scenario.orbit_context.vulnerabilities:
            actions.append(AgentAction(
                id=f"act-{uuid.uuid4()}",
                type="request_review",
                title="Requested Security review from AppSec",
                target=f"MR #{scenario.merge_request.iid}",
                orbit_basis=[v["id"] for v in scenario.orbit_context.vulnerabilities] + ["team-security"],
                status="executed"
            ))
            
        # Check dependency/incident risk
        if scenario.orbit_context.incidents:
            actions.append(AgentAction(
                id=f"act-{uuid.uuid4()}",
                type="post_mr_comment",
                title="Posted MR comment with causal chain of historical incidents",
                target=f"MR #{scenario.merge_request.iid}",
                orbit_basis=[i["id"] for i in scenario.orbit_context.incidents],
                status="executed"
            ))
            
        # Canary gate
        if simulation.recommendation.strategy.startswith("Canary"):
            actions.append(AgentAction(
                id=f"act-{uuid.uuid4()}",
                type="add_rollout_gate",
                title="Added canary rollout gate",
                target="production deployment",
                orbit_basis=["deployments", scenario.orbit_context.ownership[0]["owns"] if scenario.orbit_context.ownership else "service"],
                status="executed"
            ))
            
        # Contract validation
        if simulation.recommendation.confidence < 0.8:
            actions.append(AgentAction(
                id=f"act-{uuid.uuid4()}",
                type="trigger_pipeline",
                title="Triggered strict contract validation",
                target="contract-tests",
                orbit_basis=["pipeline gap", "API drift prevention"],
                status="executed"
            ))

        if not actions:
            actions.append(AgentAction(
                id=f"act-{uuid.uuid4()}",
                type="approve",
                title="Auto-approved based on low risk profile",
                target=f"MR #{scenario.merge_request.iid}",
                orbit_basis=["Historical stability", "Clean pipeline"],
                status="executed"
            ))

        return actions
