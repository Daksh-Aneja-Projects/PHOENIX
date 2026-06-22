# Project Phoenix

The Decision Intelligence Layer for Software Delivery.

Phoenix is a GitLab Transcend Hackathon MVP that demonstrates:

- Orbit-powered Software Future Twin
- Future Timeline Simulation
- Black Swan Detection
- Autonomous Mitigation Agents

The MVP is intentionally demo-focused: one curated merge request, three cinematic screens, real API calls, deterministic simulation, and auditable mitigation actions.

## Demo Story

1. User opens Phoenix.
2. Merge Request `#4821` is displayed.
3. Enterprise Twin View visualizes the software organization.
4. Orbit context is ingested.
5. Risk propagates through the Software Future Twin.
6. Future Timeline simulates multiple futures.
7. Black Swan Future is discovered.
8. Mitigation agents execute.
9. Recommendation is produced.
10. Risk is visibly reduced.

## Repository

```text
apps/api      FastAPI backend
apps/web      Next.js App Router frontend
demo-data     Synthetic Orbit-derived scenario fixtures
docs          Demo and architecture notes
```

## Run Locally

Backend:

```powershell
cd D:\Phoenix
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -e ".\apps\api[dev]"
cd D:\Phoenix\apps\api
D:\Phoenix\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000
```

Frontend:

```powershell
cd D:\Phoenix\apps\web
npm.cmd install
npm.cmd run dev
```

Open `http://localhost:3000`.

## API

- `GET /scenario`
- `GET /twin`
- `POST /simulate`
- `POST /agents/mitigate`
- `GET /audit`
