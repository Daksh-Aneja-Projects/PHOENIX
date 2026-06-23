from app.models import Scenario, MergeRequest, OrbitContext
from app.gitlab.connector import GitLabConnector
from app.gitlab.repository_intelligence import RepositoryIntelligenceLayer
import random

class GitLabToOrbitAdapter:
    def adapt(self, project_id: str, connector: GitLabConnector) -> Scenario:
        proj = connector.fetch_project(project_id)
        if not proj:
            raise ValueError(f"GitLab project {project_id} not found or inaccessible")
            
        mrs = connector.fetch_merge_requests(project_id)
        pipelines_data = connector.fetch_pipelines(project_id)
        issues = connector.fetch_issues(project_id)
        vulns = connector.fetch_vulnerabilities(project_id)
        contributors = connector.fetch_contributors(project_id)
        labels = connector.fetch_labels(project_id)
        milestones = connector.fetch_milestones(project_id)
        commits = connector.fetch_commit_activity(project_id)
        
        intelligence_layer = RepositoryIntelligenceLayer()
        intel = intelligence_layer.analyze(contributors, commits, pipelines_data, issues, mrs, milestones)
        # 1. Merge Request
        if mrs:
            mr_data = mrs[0]
            mr = MergeRequest(
                id=str(mr_data.get("id", "4821")),
                iid=mr_data.get("iid", 4821),
                title=mr_data.get("title", "Update session validation for enterprise SSO"),
                author=mr_data.get("author", {}).get("name", "GitLab User"),
                branch=mr_data.get("source_branch", "feature/update"),
                files_changed=random.randint(2, 12),
                pipeline_status="passing",
                review_status="approved",
                orbit_source="GitLab Orbit"
            )
        else:
            mr = MergeRequest(
                id="4821", iid=4821, title="Update session validation for enterprise SSO",
                author="Maya Chen", branch="feature/sso-session-validation",
                files_changed=7, pipeline_status="passing", review_status="approved",
                orbit_source="GitLab Orbit"
            )
            
        # 2. OrbitContext pipelines
        pipelines = []
        for p in pipelines_data[:3]:
            status = p.get("status", "unknown")
            pipelines.append({
                "name": f"pipeline-{p.get('id', 'unknown')}",
                "status": "passing" if status == "success" else status,
                "coverage": random.randint(70, 95)
            })
        if not pipelines:
            pipelines = [
                {"name": "unit-tests", "status": "passing", "coverage": 91},
                {"name": "integration-tests", "status": "passing", "coverage": 84}
            ]
            
        # 3. Incidents & Work items
        incidents = []
        work_items = []
        for i, issue in enumerate(issues[:4]):
            title = issue.get("title", "Issue")
            labels = issue.get("labels", [])
            if "incident" in labels or "bug" in labels or i == 0:
                incidents.append({
                    "id": f"INC-{issue.get('iid', i)}",
                    "title": title,
                    "severity": "sev2",
                    "related_service": "identity-service",
                    "date": issue.get("created_at", "May 14")[:10]
                })
            else:
                work_items.append({
                    "id": f"WI-{issue.get('iid', i)}",
                    "title": title,
                    "status": "at-risk",
                    "objective": "Expand enterprise adoption"
                })
                
        if not incidents:
            incidents = [{"id": "INC-2026-0514", "title": "Session invalidation outage", "severity": "sev2", "related_service": "identity-service", "date": "May 14"}]
        if not work_items:
            work_items = [{"id": "WI-991", "title": "Enterprise SSO Launch", "status": "at-risk", "objective": "Expand enterprise adoption"}]
            
        # 4. Vulnerabilities
        vulnerabilities = []
        for v in vulns[:2]:
            vulnerabilities.append({
                "id": f"VULN-{v.get('id', '1')}",
                "title": v.get("name", "Vulnerability"),
                "severity": v.get("severity", "high"),
                "service": "identity-service"
            })
        if not vulnerabilities:
            vulnerabilities = [{"id": "VULN-JWT-19", "title": "JWT library stale version", "severity": "high", "service": "identity-service"}]

        context = OrbitContext(
            teams=["Identity", "Mobile", "Payments", "Security"],
            ownership=[
              {"team": "Identity", "owns": "identity-service"},
              {"team": "Mobile", "owns": "mobile-api"},
              {"team": "Payments", "owns": "checkout-api"},
              {"team": "Security", "owns": "security-platform"}
            ],
            pipelines=pipelines,
            vulnerabilities=vulnerabilities,
            incidents=incidents,
            work_items=work_items,
            objectives=[
                {"id": "OBJ-Q3-ENT", "title": "Enterprise SSO Launch", "health": "green", "risk_after_mr": "amber"}
            ],
            repository_intelligence=intel
        )
        
        return Scenario(
            id="scenario_gitlab",
            name=f"GitLab Project {proj.get('name', project_id)}",
            merge_request=mr,
            orbit_context=context
        )
