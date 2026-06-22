from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_scenario_exposes_orbit_context() -> None:
    response = client.get("/scenario")
    assert response.status_code == 200
    payload = response.json()
    assert payload["merge_request"]["id"] == "4821"
    assert "vulnerabilities" in payload["orbit_context"]
    assert payload["orbit_context"]["pipelines"][2]["status"] == "missing"


def test_twin_contains_propagation_path() -> None:
    response = client.get("/twin")
    assert response.status_code == 200
    payload = response.json()
    assert payload["blast_radius_score"] == 82
    assert payload["propagation_path"] == ["mr-4821", "identity-service", "mobile-api", "enterprise-sso"]


def test_simulation_reveals_black_swan() -> None:
    response = client.post("/simulate")
    assert response.status_code == 200
    payload = response.json()
    assert payload["simulation_count"] == 300
    assert payload["black_swan"]["probability"] == 0.048
    assert payload["recommendation"]["strategy"] == "Canary + Contract Validation + Security Review"


def test_agents_execute_mitigation() -> None:
    response = client.post("/agents/mitigate", json={"mr_id": "4821"})
    assert response.status_code == 200
    payload = response.json()
    assert payload["risk_before"] == 84
    assert payload["risk_after"] == 38
    assert all(action["status"] == "executed" for action in payload["actions"])
