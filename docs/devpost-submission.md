# Project Phoenix Devpost Submission

## Problem

Modern software teams have excellent tools for understanding what changed: diffs, code review, pipelines, security scans, incidents, and issue trackers. The hard question is still mostly answered by human intuition:

What happens next if we merge this?

A merge request can have a green pipeline and still create a future incident because the risky context lives outside the diff: ownership, stale dependencies, missing validations, prior incidents, work item dependencies, deployment topology, and business objectives.

## Solution

Project Phoenix is the Decision Intelligence Layer for Software Delivery.

Phoenix turns a merge request into a simulated decision. It uses GitLab Orbit-derived context to build a Software Future Twin of the organization, projects multiple future outcomes, detects hidden black swan risks, and launches mitigation agents before the change is merged.

The MVP demonstrates one complete story:

An approved MR with a green pipeline updates session validation for Enterprise SSO. Phoenix ingests Orbit context, discovers a low-probability but critical future incident, and coordinates mitigation that reduces blast radius from 71 to 38.

## How Orbit Was Used

Phoenix treats Orbit as the foundation of a living software twin, not just a context retrieval layer.

Orbit-derived signals used in the demo:

- Merge Request: MR `#4821`, changed files, approved review, green pipeline.
- Team Ownership: Identity, Mobile, Payments, and Security ownership paths.
- Work Items: Enterprise SSO launch, mobile session compatibility, JWT dependency patch.
- Vulnerabilities: stale JWT library and mobile token refresh edge case.
- Historical Incidents: prior session invalidation outage and checkout auth regression.
- Pipelines: unit and integration tests passing, mobile contract tests missing.
- Deployment Topology: staging, canary, and production rollout paths.
- Business Objective: Enterprise SSO launch and checkout revenue protection.

Every simulation, black swan explanation, recommendation, and mitigation action traces back to these Orbit signals.

## Architecture

Phoenix is a focused hackathon MVP with a real API boundary and polished cinematic UI.

- Frontend: Next.js App Router, TypeScript, Tailwind, React Query, Framer Motion, React Flow, Recharts.
- Backend: FastAPI, Pydantic, async service structure, OpenAPI endpoints.
- Data: JSON fixtures representing synthetic GitLab Orbit context.
- Services: Scenario, Twin, Simulation, and Agent services.

Required API endpoints:

- `GET /scenario`
- `GET /twin`
- `POST /simulate`
- `POST /agents/mitigate`
- `GET /audit`

## Demo Flow

1. Open Phoenix.
2. MR `#4821` is displayed as green and approved.
3. User ingests Orbit context.
4. Enterprise Twin View connects services, teams, vulnerabilities, incidents, work items, deployments, and objectives.
5. Simulation begins with a cinematic Orbit Moment.
6. Phoenix reveals one hidden future.
7. Future Timeline compares merge, canary, contract tests, and split MR strategies.
8. Black Swan Radar explains a 4.8% critical Enterprise SSO failure path.
9. Mitigation agents execute.
10. Risk collapses from 71 to 38 and the final before/after panel appears.

## Technical Implementation

Phoenix uses deterministic simulation to make the demo stable while preserving technical credibility.

- React Query calls real backend endpoints.
- FastAPI validates all responses with Pydantic schemas.
- React Flow renders the Software Future Twin graph.
- Framer Motion drives the Orbit reveal, risk propagation, black swan reveal, and mitigation collapse.
- Recharts renders future risk timelines.
- Agent actions are auditable and returned by the backend.
- `?judge=true` enables an autoplay mode for rapid judge evaluation.

## Agentic Workflows

Phoenix agents do not write code. They coordinate delivery risk mitigation.

In the demo, agents:

- Request Security review from Priya Shah.
- Trigger mobile contract validation.
- Create a JWT dependency patch work item.
- Post an MR comment with the causal chain.
- Add a canary rollout gate.

Each action is grounded in Orbit evidence and appears in the audit trail.

## Black Swan Detection

Phoenix detects the future that a normal green pipeline misses.

Black Swan Future:

- Probability: 4.8%
- Impact: Critical
- Trigger: stale mobile clients + session validation change + JWT dependency drift
- Outcome: Enterprise SSO login failures after rollout

Causal chain:

MR `#4821` -> Identity Service -> Mobile API -> JWT Drift -> Enterprise SSO Launch -> Customer Impact

The key differentiator is explainability: every step shows its source Orbit signal.

## Future Vision

Phoenix can become the decision intelligence layer across the entire software delivery lifecycle.

Future extensions:

- Live GitLab Orbit connector.
- Persistent Neo4j Software Future Twin.
- Historical calibration from real incident and deployment outcomes.
- Continuous black swan scanning for active MRs.
- Agentic mitigation with real GitLab writeback.
- Executive decision views that map engineering decisions to business objectives.

Phoenix's long-term vision is simple:

Every meaningful software delivery decision should be simulated before it is executed.

