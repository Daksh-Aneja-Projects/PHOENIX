from app.models import Scenario, Twin, TwinEdge, TwinNode
from app.memory.engine import MemoryEngine

class FutureTwinGenerator:
    def __init__(self):
        self.memory_engine = MemoryEngine()

    def generate(self, scenario: Scenario) -> Twin:
        nodes = []
        edges = []
        
        orbit = scenario.orbit_context
        memories = self.memory_engine.extract_memories(orbit)

        # Merge Request Node
        mr_id = f"mr-{scenario.merge_request.iid}"
        nodes.append(TwinNode(id=mr_id, label=f"MR #{scenario.merge_request.iid}", type="merge_request", risk=50, orbit="GitLab Orbit"))

        # Add Teams and Ownership
        services_owned = {}
        for owner in orbit.ownership:
            team_id = f"team-{owner['team'].lower().replace(' ', '-')}"
            service_id = owner['owns']
            
            if not any(n.id == team_id for n in nodes):
                nodes.append(TwinNode(id=team_id, label=f"Team {owner['team']}", type="team", risk=10, orbit="Ownership Memory"))
            
            if not any(n.id == service_id for n in nodes):
                nodes.append(TwinNode(id=service_id, label=service_id, type="service", risk=20, orbit="GitLab Orbit"))
                
            edges.append(TwinEdge(id=f"edge-{team_id}-{service_id}", source=team_id, target=service_id, relationship="OWNS", weight=0.9))
            
            # Connect MR to primary service (assume first owned service is primary)
            if len(services_owned) == 0:
                edges.append(TwinEdge(id=f"edge-{mr_id}-{service_id}", source=mr_id, target=service_id, relationship="UPDATES", weight=1.0))
            
            services_owned[service_id] = team_id

        # Add Incidents
        for incident in orbit.incidents:
            inc_id = f"incident-{incident['id'].lower()}"
            nodes.append(TwinNode(id=inc_id, label=incident["title"], type="incident", risk=90, orbit="Incident Memory"))
            if incident["related_service"] in services_owned:
                edges.append(TwinEdge(id=f"edge-{inc_id}-{incident['related_service']}", source=inc_id, target=incident["related_service"], relationship="AFFECTS", weight=0.8))

        # Add Vulnerabilities
        for vuln in orbit.vulnerabilities:
            vuln_id = f"vuln-{vuln['id'].lower()}"
            nodes.append(TwinNode(id=vuln_id, label=vuln["title"], type="vulnerability", risk=85, orbit="Dependency Memory"))
            if vuln["service"] in services_owned:
                edges.append(TwinEdge(id=f"edge-{vuln_id}-{vuln['service']}", source=vuln_id, target=vuln["service"], relationship="EXPOSES", weight=0.7))

        # Add Objectives
        for obj in orbit.objectives:
            obj_id = f"obj-{obj['id'].lower()}"
            nodes.append(TwinNode(id=obj_id, label=obj["title"], type="objective", risk=30, orbit="Objective Memory"))
            # Connect primary service to objective
            if services_owned:
                primary_service = list(services_owned.keys())[0]
                edges.append(TwinEdge(id=f"edge-{primary_service}-{obj_id}", source=primary_service, target=obj_id, relationship="DRIVES", weight=0.6))

        # Build propagation path based on edges connected to the MR
        propagation_path = set()
        queue = [mr_id]
        while queue:
            current = queue.pop(0)
            propagation_path.add(current)
            for edge in edges:
                if edge.source == current and edge.target not in propagation_path:
                    queue.append(edge.target)
                elif edge.target == current and edge.source not in propagation_path:
                    queue.append(edge.source)

        return Twin(
            nodes=nodes,
            edges=edges,
            propagation_path=list(propagation_path),
            blast_radius_score=len(propagation_path) * 15
        )
