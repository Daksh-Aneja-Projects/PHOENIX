import json
import os
import urllib.request
from typing import Any

class GitLabConnector:
    def __init__(self):
        self.url = os.getenv("GITLAB_URL", "https://gitlab.com").rstrip("/")
        self.token = os.getenv("GITLAB_TOKEN", "")
    
    def _fetch(self, path: str) -> Any:
        url = f"{self.url}/api/v4/{path}"
        req = urllib.request.Request(url)
        if self.token:
            req.add_header("PRIVATE-TOKEN", self.token)
        try:
            with urllib.request.urlopen(req) as response:
                return json.loads(response.read().decode())
        except Exception as e:
            print(f"GitLab API Error: {url} -> {e}")
            return None

    def fetch_project(self, project_id: str) -> dict:
        return self._fetch(f"projects/{project_id}") or {}

    def fetch_merge_requests(self, project_id: str) -> list[dict]:
        return self._fetch(f"projects/{project_id}/merge_requests?state=opened&per_page=5") or []

    def fetch_pipelines(self, project_id: str) -> list[dict]:
        return self._fetch(f"projects/{project_id}/pipelines?per_page=10") or []

    def fetch_issues(self, project_id: str) -> list[dict]:
        return self._fetch(f"projects/{project_id}/issues?state=opened&per_page=10") or []

    def fetch_contributors(self, project_id: str) -> list[dict]:
        return self._fetch(f"projects/{project_id}/repository/contributors") or []

    # Note: Vulnerability API is only available in Ultimate, we fetch it and fall back gracefully
    def fetch_vulnerabilities(self, project_id: str) -> list[dict]:
        return self._fetch(f"projects/{project_id}/vulnerabilities?per_page=5") or []

    def fetch_labels(self, project_id: str) -> list[dict]:
        return self._fetch(f"projects/{project_id}/labels?per_page=10") or []

    def fetch_milestones(self, project_id: str) -> list[dict]:
        return self._fetch(f"projects/{project_id}/milestones?state=active&per_page=5") or []

    def fetch_commit_activity(self, project_id: str) -> list[dict]:
        return self._fetch(f"projects/{project_id}/repository/commits?per_page=20") or []
