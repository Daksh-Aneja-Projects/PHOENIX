from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_scenario_exposes_orbit_context() -> None:
    response = client.get("/scenario")
    assert response.status_code == 200
    payload = response.json()
    assert payload["merge_request"]["id"] == "4821"
    assert "vulnerabilities" in payload["orbit_context"]
    assert len(payload["orbit_context"]["pipelines"]) > 0

def test_twin_contains_propagation_path() -> None:
    response = client.get("/twin")
    assert response.status_code == 200
    payload = response.json()
    assert payload["blast_radius_score"] > 50
    assert len(payload["propagation_path"]) >= 2

def test_simulation_reveals_black_swan() -> None:
    response = client.post("/simulate")
    assert response.status_code == 200
    payload = response.json()
    assert payload["simulation_count"] > 100
    assert payload["black_swan"]["probability"] > 0
    assert payload["recommendation"]["strategy"] is not None

def test_agents_execute_mitigation() -> None:
    response = client.post("/agents/mitigate", json={"mr_id": "4821"})
    assert response.status_code == 200
    payload = response.json()
    assert payload["risk_before"] > payload["risk_after"]
    assert all(action["status"] == "executed" for action in payload["actions"])
