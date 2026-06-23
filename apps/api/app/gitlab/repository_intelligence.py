from typing import Any

class RepositoryIntelligenceLayer:
    def analyze(self, 
                contributors: list[dict], 
                commits: list[dict], 
                pipelines: list[dict], 
                issues: list[dict], 
                mrs: list[dict], 
                milestones: list[dict]) -> dict[str, Any]:
        
        total_commits = sum([c.get("commits", 0) for c in contributors])
        top_contributor_commits = max([c.get("commits", 0) for c in contributors]) if contributors else 0
        
        concentration_ratio = top_contributor_commits / total_commits if total_commits > 0 else 0
        if concentration_ratio > 0.5:
            contributor_concentration = "HIGH"
        elif concentration_ratio > 0.3:
            contributor_concentration = "MEDIUM"
        else:
            contributor_concentration = "LOW"
            
        total_pipelines = len(pipelines)
        failed_pipelines = len([p for p in pipelines if p.get("status") in ["failed", "canceled"]])
        failure_rate = failed_pipelines / total_pipelines if total_pipelines > 0 else 0
        if failure_rate > 0.3:
            pipeline_stability = "LOW"
        elif failure_rate > 0.1:
            pipeline_stability = "MEDIUM"
        else:
            pipeline_stability = "HIGH"
            
        open_issues = len(issues)
        if open_issues > 50:
            issue_pressure = "HIGH"
        elif open_issues > 20:
            issue_pressure = "MEDIUM"
        else:
            issue_pressure = "LOW"
            
        active_milestones = len(milestones)
        if active_milestones > 2:
            release_pressure = "HIGH"
        elif active_milestones > 0:
            release_pressure = "MEDIUM"
        else:
            release_pressure = "LOW"
            
        ownership_concentration = contributor_concentration
        
        engineering_load = len(issues) + len(mrs)
        
        score = 100
        if contributor_concentration == "HIGH": score -= 15
        elif contributor_concentration == "MEDIUM": score -= 5
        
        if pipeline_stability == "LOW": score -= 25
        elif pipeline_stability == "MEDIUM": score -= 10
        
        if issue_pressure == "HIGH": score -= 10
        elif issue_pressure == "MEDIUM": score -= 5
        
        if release_pressure == "HIGH": score -= 10
        
        return {
            "contributor_concentration": contributor_concentration,
            "pipeline_stability": pipeline_stability,
            "issue_pressure": issue_pressure,
            "release_pressure": release_pressure,
            "ownership_concentration": ownership_concentration,
            "engineering_load": engineering_load,
            "score": max(0, score)
        }
