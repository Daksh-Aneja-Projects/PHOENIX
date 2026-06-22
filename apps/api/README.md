# Phoenix API

Run:

```powershell
cd D:\Phoenix
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -e ".\apps\api[dev]"
cd D:\Phoenix\apps\api
D:\Phoenix\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000
```

Endpoints:

- `GET /scenario`
- `GET /twin`
- `POST /simulate`
- `POST /agents/mitigate`
- `GET /audit`
