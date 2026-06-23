# Project Phoenix

The Decision Intelligence & Operational Intelligence System for Software Delivery.

Phoenix is a cutting-edge repository intelligence platform built to monitor, simulate, and mitigate catastrophic risk in enterprise software delivery. Rather than reacting to incidents after they happen, Phoenix constructs a "Software Future Twin" to simulate thousands of potential outcomes from a single Merge Request and deploys autonomous agents to prevent "Black Swan" events before the code is merged.

## Core Capabilities

- **Repository Intelligence Ingestion:** Automatically builds an enterprise context graph using live GitLab merge requests, milestones, issues, contributors, and pipelines.
- **Software Future Twin:** Reconstructs your repository's microservices, dependencies, teams, and ownership into an active graph.
- **Diverging Timeline Simulation:** Runs context-aware simulations (via `ContextualRiskEngine`) mapping out the probability of failures across multiple mitigation strategies.
- **Black Swan Discovery:** Detects high-impact, low-probability cascading failures based on deep context.
- **Agent Mitigations:** Autonomous agent planning to deploy contract testing, security canary rollouts, or compliance gates.

## Architecture

```text
apps/api      FastAPI backend (ContextualRiskEngine, BlackSwanEngine, DecisionEngine)
apps/web      Next.js App Router frontend (Live Intelligence Operations UI)
data-cache    Local fixture repository cache for real-time repository data
```

The system operates by integrating directly with GitLab via `GitLabConnector`, adapting the raw repository data into `OrbitContext` through the `GitLabToOrbitAdapter`, generating a `Twin` graph, and executing simulations.

## Local Setup

### Prerequisites
- Node.js 18+
- Python 3.10+
- A GitLab Personal Access Token

### Backend API
The backend requires a `GITLAB_TOKEN` to parse live repositories.

```powershell
cd apps/api
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -e ".[dev]"

# Copy .env configuration
cp .env.example .env
# Edit .env and insert your GITLAB_TOKEN

# Start the server
uvicorn app.main:app --reload --port 8000
```

### Frontend UI
The UI requires the `NEXT_PUBLIC_API_BASE_URL` pointing to your backend.

```powershell
cd apps/web
npm install

# Copy .env configuration
cp .env.example .env

# Start the dev server
npm run dev
```

## Running the Intelligence Center

1. Open `http://localhost:3000`
2. You can test live repository intelligence by appending the project parameter:
   `http://localhost:3000/?source=gitlab`
3. (Demo Mode) To automatically run the 120-second cinematic simulation rollout:
   `http://localhost:3000/?source=gitlab&judge=true`

## License
MIT License.
