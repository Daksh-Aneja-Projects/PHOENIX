from app.models import BlackSwan, OrbitContext
from app.memory.engine import MemoryEngine

class BlackSwanEngine:
    def __init__(self):
        self.memory_engine = MemoryEngine()

    def discover(self, orbit: OrbitContext) -> BlackSwan:
        memories = self.memory_engine.extract_memories(orbit)
        
        has_incidents = any(m.type == "incident" for m in memories)
        has_vulns = any(m.type == "dependency" for m in memories)
        has_complex_ownership = len([m for m in memories if m.type == "ownership"]) > 2

        if has_incidents and has_vulns and has_complex_ownership:
            # Complex Enterprise scenario
            return BlackSwan(
                probability=0.08,
                impact="critical",
                title="Cascading failure mirroring May 14 Session Outage",
                trigger="Exploitation of JWT drift combined with overload from mobile clients",
                causal_chain=[
                    "MR #4821 merges bypassing security checks",
                    "Identity Service deploys updated validation",
                    "Mobile API instances trigger full re-authentication",
                    "JWT Vulnerability is exposed to unthrottled traffic",
                    "Enterprise SSO Launch blocked by outage",
                    "Critical Customer Impact"
                ],
                orbit_evidence=[
                    "Merge Request + Pipeline",
                    "Team Ownership Memory",
                    "Dependency Memory",
                    "Vulnerability Memory",
                    "Objective Memory",
                    "Historical Incident Memory"
                ]
            )
        elif has_incidents and not has_vulns:
            # Midsize scenario
            return BlackSwan(
                probability=0.04,
                impact="high",
                title="Auth timeout during initial traffic spike",
                trigger="Missing rate limit on login endpoint is overwhelmed",
                causal_chain=[
                    "MR #4821 lands in Auth Service",
                    "Frontend e2e tests were ignored",
                    "Self-serve SSO launch drives 3x traffic",
                    "Database connection pool exhausted",
                    "Auth timeout mimics Aug 10 incident"
                ],
                orbit_evidence=[
                    "Merge Request",
                    "Failed Pipeline Memory",
                    "Work Item Memory",
                    "Service Memory",
                    "Historical Incident Memory"
                ]
            )
        else:
            # Small scenario
            return BlackSwan(
                probability=0.01,
                impact="low",
                title="Minor rollback due to unhandled edge case",
                trigger="Unexpected payload format from legacy client",
                causal_chain=[
                    "MR #4821 deployed to monolith",
                    "Legacy client sends malformed session token",
                    "Monolith returns 500",
                    "Quick rollback initiated"
                ],
                orbit_evidence=[
                    "Merge Request",
                    "Ownership Memory",
                    "Service Memory",
                    "Pipeline Memory"
                ]
            )
