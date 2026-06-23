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
        
        intel = orbit.repository_intelligence or {}
        single_maintainer = intel.get("contributor_concentration") == "HIGH"
        issue_backlog = intel.get("issue_pressure") == "HIGH"
        release_pressure = intel.get("release_pressure") == "HIGH"
        pipeline_instability = intel.get("pipeline_stability") == "LOW"

        if single_maintainer and has_incidents:
            return BlackSwan(
                probability=0.15,
                impact="critical",
                title="Bus factor vulnerability exposed during outage",
                trigger="Key maintainer unavailable during cascading failure",
                causal_chain=[
                    "MR #4821 merges and introduces regression",
                    "Pipeline instability masks the failure",
                    "Incident triggered in production",
                    "Single maintainer is offline",
                    "Extended downtime due to knowledge silo"
                ],
                orbit_evidence=["Contributor Memory", "Historical Incident Memory"]
            )
        elif release_pressure and pipeline_instability:
            return BlackSwan(
                probability=0.12,
                impact="high",
                title="Critical release collision",
                trigger="Deployment pressure forces bypass of failing tests",
                causal_chain=[
                    "High number of active milestones",
                    "Engineers ignore intermittent test failures",
                    "Bad merge goes to production",
                    "Rollback fails due to database migration"
                ],
                orbit_evidence=["Release Memory", "Pipeline Memory"]
            )
        elif issue_backlog and has_vulns:
            return BlackSwan(
                probability=0.09,
                impact="critical",
                title="Vulnerability exploited via unpatched backlog",
                trigger="Attacker targets known vulnerability buried in backlog",
                causal_chain=[
                    "High issue backlog obscures critical security patch",
                    "Automated scan discovers vulnerability",
                    "Patch delayed by engineering load",
                    "Active exploit in production"
                ],
                orbit_evidence=["Issue Memory", "Vulnerability Memory"]
            )
        elif has_incidents and has_vulns and has_complex_ownership:

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
