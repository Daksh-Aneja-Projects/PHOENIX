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

export function getScenario() {
  return request<Scenario>("/scenario");
}

export function getTwin() {
  return request<Twin>("/twin");
}

export function runSimulation() {
  return request<SimulationResult>("/simulate", { method: "POST" });
}

export function mitigate() {
  return request<AuditLog>("/agents/mitigate", {
    method: "POST",
    body: JSON.stringify({ mr_id: "4821" })
  });
}

