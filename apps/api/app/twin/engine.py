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

        services_owned = {}
        # 1. Services & Ownership
        for owner in orbit.ownership:
            team_id = f"team-{owner['team'].lower().replace(' ', '-')}"
            service_id = f"service-{owner['owns'].lower().replace(' ', '-')}"
            
            if not any(n.id == team_id for n in nodes):
                nodes.append(TwinNode(id=team_id, label=owner['team'], type="team", risk=10, orbit="Contributor Memory"))
            if not any(n.id == service_id for n in nodes):
                nodes.append(TwinNode(id=service_id, label=owner['owns'], type="service", risk=20, orbit="Label Memory"))
                
            edges.append(TwinEdge(id=f"edge-{team_id}-{service_id}", source=team_id, target=service_id, relationship="OWNS", weight=0.9))
            services_owned[owner['owns']] = service_id

        # Connect MR to ALL services (to show wide blast radius)
        for svc_id in services_owned.values():
            edges.append(TwinEdge(id=f"edge-{mr_id}-{svc_id}", source=mr_id, target=svc_id, relationship="AFFECTS", weight=0.8))

        # 2. Incidents
        for incident in orbit.incidents:
            inc_id = f"incident-{incident['id'].lower()}"
            nodes.append(TwinNode(id=inc_id, label=incident["title"], type="incident", risk=90, orbit="Issue Memory"))
            svc_key = incident.get("related_service", list(services_owned.keys())[0] if services_owned else "default")
            svc_id = services_owned.get(svc_key, list(services_owned.values())[0] if services_owned else mr_id)
            edges.append(TwinEdge(id=f"edge-{inc_id}-{svc_id}", source=inc_id, target=svc_id, relationship="AFFECTED", weight=0.9))

        # 3. Vulnerabilities
        for vuln in orbit.vulnerabilities:
            vuln_id = f"vuln-{vuln['id'].lower()}"
            nodes.append(TwinNode(id=vuln_id, label=vuln["title"], type="vulnerability", risk=85, orbit="Dependency Memory"))
            svc_key = vuln.get("service", list(services_owned.keys())[0] if services_owned else "default")
            svc_id = services_owned.get(svc_key, list(services_owned.values())[0] if services_owned else mr_id)
            edges.append(TwinEdge(id=f"edge-{vuln_id}-{svc_id}", source=vuln_id, target=svc_id, relationship="EXPOSES", weight=0.7))

        # 4. Objectives
        for obj in orbit.objectives:
            obj_id = f"obj-{obj['id'].lower()}"
            nodes.append(TwinNode(id=obj_id, label=obj["title"], type="objective", risk=30, orbit="Milestone Memory"))
            if services_owned:
                for svc_id in services_owned.values():
                    edges.append(TwinEdge(id=f"edge-{svc_id}-{obj_id}", source=svc_id, target=obj_id, relationship="DRIVES", weight=0.6))
                    
        # 5. Work Items (from issues)
        for wi in orbit.work_items:
            wi_id = f"wi-{wi['id'].lower()}"
            # map work_items to objective type since twin doesn't have a specific "work_item" node visual type but it fits.
            # wait, TwinNode type Literal["merge_request", "service", "objective", "team", "vulnerability", "incident"]
            nodes.append(TwinNode(id=wi_id, label=wi["title"], type="objective", risk=40, orbit="Issue Memory"))
            # connect them to the MR directly
            edges.append(TwinEdge(id=f"edge-{mr_id}-{wi_id}", source=mr_id, target=wi_id, relationship="BLOCKED_BY", weight=0.4))

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
            blast_radius_score=min(100, len(propagation_path) * 15)
        )
