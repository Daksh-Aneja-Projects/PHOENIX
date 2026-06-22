# MVP Architecture

Phoenix is implemented as a focused hackathon demo with a real API boundary and curated Orbit-derived fixtures.

## Components

- `apps/web`: Next.js App Router demo cockpit with three screens.
- `apps/api`: FastAPI service exposing scenario, twin, simulation, mitigation, and audit endpoints.
- `demo-data`: Synthetic GitLab Orbit context for MR `#4821`.

## Demo-Critical Data Flow

1. Frontend loads `/scenario` to show MR `#4821` and Orbit context.
2. User ingests Orbit context, then frontend loads `/twin`.
3. Enterprise Twin View animates graph propagation across services, teams, vulnerabilities, incidents, work items, and objectives.
4. User runs `/simulate`.
5. Future Timeline shows four future strategies across Now, Day +1, Day +7, Day +30.
6. Black Swan Radar reveals the 4.8% critical enterprise SSO failure.
7. User runs `/agents/mitigate`.
8. Agent actions execute and the UI shows risk collapse.

## What Is Real

- FastAPI endpoints.
- Pydantic response schemas.
- Frontend API calls through React Query.
- Deterministic simulation response.
- Auditable mitigation state.
- Animated React graph, timeline, radar, and mitigation effects.

## What Is Synthetic

- GitLab Orbit context.
- Merge request data.
- Outcome clusters.
- Black swan causal chain.
- Agent side effects.

Synthetic data is acceptable because the hackathon story is about using Orbit as a living software twin substrate, not proving production integrations.

