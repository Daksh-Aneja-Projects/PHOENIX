# Project Phoenix Demo Video Script

## 90-Second Version

### 0:00-0:10

Narration:

"This merge request looks safe: approved review, green pipeline, only seven changed files. Most tools stop there. Phoenix asks: what future does this decision create?"

Visual:

Show MR `#4821`.

### 0:10-0:25

Narration:

"Phoenix ingests GitLab Orbit context: ownership, work items, vulnerabilities, incidents, pipelines, deployment topology, and business objectives."

Visual:

Click `Ingest Orbit Context`. Show Enterprise Twin View and Orbit Signals Used.

### 0:25-0:45

Narration:

"This creates a Software Future Twin: a living model of how a change propagates through services, teams, risks, and objectives."

Visual:

Show risk wave from MR to Identity Service, Mobile API, and Enterprise SSO.

### 0:45-1:05

Narration:

"Phoenix simulates possible futures. The average case is manageable, but Orbit reveals a hidden black swan: stale mobile clients, JWT drift, and Enterprise SSO launch risk combine into customer login failures."

Visual:

Click `Run Future Simulation`. Show Orbit Moment and Black Swan Radar.

### 1:05-1:25

Narration:

"Phoenix does not just recommend. It coordinates mitigation: security review, contract validation, a JWT patch work item, MR comment, and a canary rollout gate."

Visual:

Click `Execute Mitigation Agents`. Show agent actions and risk collapse.

### 1:25-1:30

Narration:

"Phoenix used GitLab Orbit to discover a future incident hiding behind a green pipeline."

Visual:

Show Before / After panel.

## 3-Minute Version

### 0:00-0:20

Narration:

"Here is MR `#4821`: update session validation for Enterprise SSO. It is approved. The pipeline is green. The diff is small. But Phoenix is not asking what changed. Phoenix asks what happens next."

Visual:

Open Phoenix at the MR card.

### 0:20-0:50

Narration:

"Phoenix ingests GitLab Orbit context and turns it into a Software Future Twin. This is the key: risk is not only in code. It is in ownership, pipelines, vulnerabilities, incidents, work items, deployments, and objectives."

Visual:

Click `Ingest Orbit Context`. Show Enterprise Twin View and Orbit Signals Used.

### 0:50-1:20

Narration:

"The change touches Identity Service. Orbit tells Phoenix that Mobile API depends on that flow, there is a missing mobile contract test, the JWT library is stale, and Enterprise SSO launch is an active business objective."

Visual:

Point at graph propagation and Orbit Insight Panel.

### 1:20-1:50

Narration:

"Now Phoenix simulates future strategies: merge now, canary, add contract tests, or split the MR. The timeline shows how risk evolves over Day +1, Day +7, and Day +30."

Visual:

Click `Run Future Simulation`. Show Orbit Moment and Future Timeline.

### 1:50-2:20

Narration:

"The dangerous future is not the average future. Phoenix detects a 4.8% black swan: stale mobile clients plus session validation change plus JWT dependency drift creates Enterprise SSO login failures after rollout."

Visual:

Show Black Swan Radar and causal chain.

### 2:20-2:45

Narration:

"Every step is explainable and Orbit-grounded: Merge Request, Team Ownership, Work Item Dependencies, Vulnerability, Deployment Topology, Historical Incident, and Business Objective."

Visual:

Point at each source label in the causal chain.

### 2:45-3:00

Narration:

"Phoenix executes mitigation agents: security review, contract validation, JWT patch work item, MR comment, and canary gate. The blast radius collapses from 71 to 38. Phoenix is the system that used GitLab Orbit to discover a future incident hiding behind a green pipeline."

Visual:

Click `Execute Mitigation Agents`. Show risk collapse and Before / After panel.

