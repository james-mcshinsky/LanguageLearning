"""Minimal FastAPI service exposing core project functionality."""

from __future__ import annotations

from dataclasses import asdict
from typing import Optional

from fastapi import FastAPI
from pydantic import BaseModel

from .ai_lessons import generate_lesson
from .goals import GoalItem, GoalManager
from .media_integration import suggest_media
from .storage import JSONStorage


class GoalIn(BaseModel):
    word: str
    weight: float = 1.0


def create_app(storage: Optional[JSONStorage] = None) -> FastAPI:
    """Application factory used by tests and external runners."""

    store = storage or JSONStorage("data.json")
    goal_manager = GoalManager()
    for item in store.load_goals():
        goal_manager.create_goal(item)

    app = FastAPI()

    @app.post("/goals")
    def add_goal(goal: GoalIn):
        item = GoalItem(goal.word, goal.weight)
        goal_manager.create_goal(item)
        store.save_goals(goal_manager.list_goals())
        return {"goals": [asdict(g) for g in goal_manager.list_goals()]}

    @app.get("/goals")
    def list_goals():
        return {"goals": [asdict(g) for g in goal_manager.list_goals()]}

    @app.get("/lesson")
    def lesson(topic: str):
        return generate_lesson(topic)

    @app.get("/media")
    def media(word: str, level: int):
        return suggest_media(word, level)

    return app


app = create_app()
