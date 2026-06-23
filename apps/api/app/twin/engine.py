from app.models import Scenario, Twin, TwinNode, TwinEdge
import random

class TwinEngine:
    def generate(self, scenario: Scenario) -> Twin:
        nodes = []
        edges = []
        edge_id_counter = 1

        def add_edge(source, target, rel, weight=1.0):
            nonlocal edge_id_counter
            edges.append(TwinEdge(id=f"e{edge_id_counter}", source=source, target=target, relationship=rel, weight=weight))
            edge_id_counter += 1

        # 1. MR Node
        mr_id = f"mr-{scenario.merge_request.id}"
        nodes.append(TwinNode(id=mr_id, label=f"MR #{scenario.merge_request.iid}", type="merge_request", risk=40, orbit="Merge Request"))

        # 2. Services from ownership
        services = []
        for own in scenario.orbit_context.ownership:
            srv = own["owns"]
            if srv not in services:
                services.append(srv)
                nodes.append(TwinNode(id=srv, label=srv, type="service", risk=50, orbit="Repository"))

        # 3. Teams
        for team in scenario.orbit_context.teams:
            team_id = f"team-{team.lower().replace(' ', '-')}"
            nodes.append(TwinNode(id=team_id, label=f"{team} Team", type="team", risk=30, orbit="Team"))
            
        for own in scenario.orbit_context.ownership:
            team_id = f"team-{own['team'].lower().replace(' ', '-')}"
            add_edge(team_id, own["owns"], "OWNS", 1.0)

        # 4. Vulnerabilities
        for vuln in scenario.orbit_context.vulnerabilities:
            vuln_id = vuln["id"].lower()
            nodes.append(TwinNode(id=vuln_id, label=vuln["title"], type="vulnerability", risk=80, orbit="Vulnerability"))
            add_edge(vuln_id, vuln["service"], "INTRODUCES", 0.8)

        # 5. Incidents
        for inc in scenario.orbit_context.incidents:
            inc_id = inc["id"].lower()
            nodes.append(TwinNode(id=inc_id, label=inc["title"], type="incident", risk=70, orbit="Incident"))
            add_edge(inc_id, inc["related_service"], "AFFECTS", 0.7)

        # 6. Objectives
        for obj in scenario.orbit_context.objectives:
            obj_id = obj["id"].lower()
            nodes.append(TwinNode(id=obj_id, label=obj["title"], type="objective", risk=60, orbit="Objective"))

        # Link Services (simple chain for demo purposes, or based on known logic)
        if len(services) > 0:
            add_edge(mr_id, services[0], "AFFECTS", 0.9)
            for i in range(len(services) - 1):
                add_edge(services[i], services[i+1], "DEPENDS_ON", 0.7)
            
            # Link last service to objectives
            for obj in scenario.orbit_context.objectives:
                add_edge(services[-1], obj["id"].lower(), "BLOCKS", 0.8)

        # Calculate a simple propagation path from MR to objectives
        path = [mr_id] + services
        if scenario.orbit_context.objectives:
            path.append(scenario.orbit_context.objectives[0]["id"].lower())

        return Twin(
            nodes=nodes,
            edges=edges,
            propagation_path=path,
            blast_radius_score=random.randint(60, 90)
        )
