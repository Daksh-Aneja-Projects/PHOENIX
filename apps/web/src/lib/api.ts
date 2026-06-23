import type { AuditLog, Scenario, SimulationResult, Twin } from "@/lib/types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...init?.headers
    }
  });

  if (!response.ok) {
    throw new Error(`Phoenix API error: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function getScenario(scenarioId: string = "scenario_01") {
  return request<Scenario>(`/scenario?scenario_id=${scenarioId}`);
}

export function getTwin(scenarioId: string = "scenario_01") {
  return request<Twin>(`/twin?scenario_id=${scenarioId}`);
}

export function runSimulation(scenarioId: string = "scenario_01") {
  return request<SimulationResult>(`/simulate?scenario_id=${scenarioId}`, { method: "POST" });
}

export function mitigate(scenarioId: string = "scenario_01") {
  return request<AuditLog>(`/agents/mitigate?scenario_id=${scenarioId}`, {
    method: "POST",
    body: JSON.stringify({ mr_id: "4821" })
  });
}

