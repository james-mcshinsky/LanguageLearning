"""Simple JSON-based persistence helpers.

This module provides a tiny wrapper around JSON files for persisting
user profiles, goal lists and spaced-repetition review state.  The class
is intentionally lightweight; callers supply the file path and interact
through dedicated ``save_*`` and ``load_*`` methods.
"""

from __future__ import annotations

import json
import os
from dataclasses import asdict
from typing import Any, Dict, List, Optional

from .goals import GoalItem


class JSONStorage:
    """Persist user, goal and review information in a JSON file."""

    def __init__(self, path: str) -> None:
        self.path = path

    # ------------------------------------------------------------------
    # Internal helpers
    def _read(self) -> Dict[str, Any]:
        if not os.path.exists(self.path):
            return {}
        with open(self.path, "r", encoding="utf-8") as fh:
            return json.load(fh)

    def _write(self, data: Dict[str, Any]) -> None:
        with open(self.path, "w", encoding="utf-8") as fh:
            json.dump(data, fh)

    # ------------------------------------------------------------------
    # User persistence
    def save_user(self, user: Dict[str, Any]) -> None:
        data = self._read()
        data["user"] = user
        self._write(data)

    def load_user(self) -> Optional[Dict[str, Any]]:
        return self._read().get("user")

    # ------------------------------------------------------------------
    # Goal persistence
    def save_goals(self, goals: List[GoalItem]) -> None:
        data = self._read()
        data["goals"] = [asdict(g) for g in goals]
        self._write(data)

    def load_goals(self) -> List[GoalItem]:
        data = self._read()
        return [GoalItem(**info) for info in data.get("goals", [])]

    # ------------------------------------------------------------------
    # Review state persistence
    def save_review_state(self, state: Dict[str, Any]) -> None:
        data = self._read()
        data["review_state"] = state
        self._write(data)

    def load_review_state(self) -> Dict[str, Any]:
        data = self._read()
        return data.get("review_state", {})
