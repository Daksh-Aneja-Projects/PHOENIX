import json
from pathlib import Path
from typing import Any


class JsonFixtureRepository:
    def __init__(self) -> None:
        self.root = Path(__file__).resolve().parents[3] / "demo-data"

    def load(self, name: str) -> Any:
        path = self.root / name
        with path.open("r", encoding="utf-8") as file:
            return json.load(file)

