import uuid
from app.models import MemoryObject, OrbitContext

class MemoryEngine:
    def extract_memories(self, orbit: OrbitContext) -> list[MemoryObject]:
        memories = []

        # Ownership Memory
        for owner in orbit.ownership:
            memories.append(MemoryObject(
                id=f"mem-{uuid.uuid4().hex[:8]}",
                type="ownership",
                title=f"Team {owner['team']} owns {owner['owns']}",
                relevance_score=0.8,
                orbit_signals=["ownership", f"team:{owner['team']}"],
                description=f"Critical ownership mapping. High concentration of risk if {owner['team']} is overloaded."
            ))

        # Incident Memory
        for incident in orbit.incidents:
            memories.append(MemoryObject(
                id=f"mem-{uuid.uuid4().hex[:8]}",
                type="incident",
                title=incident["title"],
                relevance_score=0.95,
                orbit_signals=["incident_history", incident["related_service"]],
                description=f"Historical {incident['severity']} incident on {incident.get('date', 'unknown date')} affecting {incident['related_service']}."
            ))

        # Objective Memory
        for obj in orbit.objectives:
            memories.append(MemoryObject(
                id=f"mem-{uuid.uuid4().hex[:8]}",
                type="objective",
                title=obj["title"],
                relevance_score=0.9,
                orbit_signals=["business_objective", obj["health"]],
                description=f"Strategic business objective currently in {obj['health']} health."
            ))

        # Work Item Memory
        for wi in orbit.work_items:
            memories.append(MemoryObject(
                id=f"mem-{uuid.uuid4().hex[:8]}",
                type="work_item",
                title=wi["title"],
                relevance_score=0.7,
                orbit_signals=["work_item", wi["status"]],
                description=f"Active work item driving {wi['objective']}."
            ))
            
        # Dependency/Deployment Memory (derived from pipelines/vulnerabilities context)
        for vuln in orbit.vulnerabilities:
            memories.append(MemoryObject(
                id=f"mem-{uuid.uuid4().hex[:8]}",
                type="dependency",
                title=f"Vulnerability in {vuln['service']}",
                relevance_score=0.85,
                orbit_signals=["security", vuln["severity"]],
                description=f"Known {vuln['severity']} vulnerability: {vuln['title']}."
            ))

        return memories

    def get_readiness_score(self, orbit: OrbitContext) -> int:
        score = 100
        # Deduct for missing pipelines
        failed_pipelines = [p for p in orbit.pipelines if p.get("status") != "passing"]
        score -= len(failed_pipelines) * 10
        # Deduct for missing ownership (arbitrary metric for demo)
        if len(orbit.ownership) < 2:
            score -= 15
        if not orbit.incidents:
            # lack of incident memory lowers readiness visibility
            score -= 5
        return max(0, min(100, score))
