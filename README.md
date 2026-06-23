# Project Phoenix

The Decision Intelligence & Operational Intelligence System for Software Delivery.

Phoenix is a repository intelligence platform that monitors, simulates, and mitigates catastrophic risk in enterprise software delivery.

Rather than reacting to incidents after they happen, Phoenix constructs a Software Future Twin that models the downstream impact of software decisions, discovers Black Swan risks, and coordinates mitigations before deployment.

---

## Core Capabilities

### Repository Intelligence Ingestion
Automatically builds enterprise context from GitLab repositories using:
* Merge Requests
* Contributors
* Issues
* Milestones
* Pipelines
* Labels
* Ownership Signals

### Software Future Twin
Builds a living graph connecting:
* Teams
* Services
* Objectives
* Dependencies
* Vulnerabilities
* Incidents
* Repository Intelligence Signals

### Diverging Timeline Simulation
Simulates multiple delivery strategies and evaluates:
* Incident Probability
* Blast Radius
* Confidence
* Risk Evolution

### Black Swan Discovery
Identifies low-probability, high-impact cascading failures hidden behind seemingly safe changes.

### Decision Intelligence
Evaluates competing strategies and explains:
* Recommended Path
* Supporting Evidence
* Rejected Alternatives

### Agent Mitigations
Coordinates mitigation workflows such as:
* Security Reviews
* Contract Validation
* Canary Gates
* Dependency Remediation

---

## Architecture

**apps/api** — FastAPI backend
* ContextualRiskEngine
* BlackSwanEngine
* DecisionEngine
* MemoryEngine
* FutureTwinGenerator

**apps/web** — Next.js Operational Intelligence UI
* Future Twin
* Divergence Timeline
* Enterprise Memory
* Decision Intelligence
* Agent Operations

The system ingests repository context through `GitLabConnector`, transforms it into `OrbitContext` via `GitLabToOrbitAdapter`, constructs a Software Future Twin, and executes simulations against that model.

---

## Local Setup

### Prerequisites
* Node.js 18+
* Python 3.10+
* GitLab Personal Access Token

### Backend

```powershell
cd apps/api
python -m venv .venv
# Activate virtual environment
.\.venv\Scripts\Activate.ps1
pip install -e ".[dev]"

# Create .env from .env.example
cp .env.example .env

# Populate:
# GITLAB_TOKEN=<token>

# Start API:
uvicorn app.main:app --reload --port 8000
```

### Frontend

```powershell
cd apps/web
npm install

# Create .env from .env.example
cp .env.example .env

# Populate:
# NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

# Start UI:
npm run dev
```

---

## Running Phoenix

**Standard Mode:**
`http://localhost:3000`

**Live GitLab Mode:**
`http://localhost:3000/?source=gitlab`

**Judge Mode:**
`http://localhost:3000/?source=gitlab&judge=true`

---

## Key Concepts

### Software Future Twin
A graph representation of repository context, ownership, dependencies, incidents, objectives, and risks.

### Enterprise Memory
Structured organizational memory extracted from historical incidents, deployment history, ownership mappings, and repository intelligence.

### Black Swan Event
A low-probability, high-impact outcome discovered through simulation and causal reasoning.

### Repository Intelligence
Signals derived from contributors, milestones, issues, pipelines, labels, and ownership patterns.

---

## API Endpoints

- `GET /health` - Service health check
- `POST /ingest` - Ingest raw orbit context
- `POST /ingest/gitlab` - Dynamically fetch and ingest data from a real GitLab project
- `GET /context/{scenario_id}/explain` - Retrieve Enterprise Memory and deep contextual insights
- `GET /scenario` - Fetch the raw scenario context
- `GET /twin` - Generate and retrieve the connected Software Future Twin graph
- `POST /simulate` - Run the context-aware simulation and black swan discovery engine
- `POST /agents/mitigate` - Deploy autonomous agents to reduce predicted risk
- `GET /audit` - Retrieve the logs of executed mitigations

---

## Screenshots

*(Insert screenshots here)*
- [x] Enterprise Memory & Repository Intelligence
- [x] Software Future Twin Graph
- [x] Black Swan Radar
- [x] Diverging Future Timeline
- [x] Agent Mission Control

---

## Demo Video

[Watch the Phoenix Demo Video (Devpost)](#) *(Link to be updated upon submission)*

---

## License

MIT License
