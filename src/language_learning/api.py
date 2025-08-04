"""Minimal FastAPI service exposing core project functionality."""

from __future__ import annotations

from dataclasses import asdict
import os
from tempfile import NamedTemporaryFile
from typing import List, Optional

from fastapi import FastAPI
from pydantic import BaseModel

from .ai_lessons import generate_lesson, generate_mcq_lesson
from .ai_blurbs import generate_blurb
from .goals import GoalItem, GoalManager, load_default_goals
from .media_integration import suggest_media
from .storage import JSONStorage
from .vocabulary import extract_vocabulary


class GoalIn(BaseModel):
    word: str
    weight: float = 1.0


class VocabularyIn(BaseModel):
    corpus: str


class LessonPromptsIn(BaseModel):
    topic: str
    new_words: list[str] | None = None
    review_words: list[str] | None = None


class BlurbIn(BaseModel):
    known_words: List[str] | None = None
    l_plus_one_words: List[str] | None = None
    length: int = 0


def create_app(storage: Optional[JSONStorage] = None) -> FastAPI:
    """Application factory used by tests and external runners."""

    store = storage or JSONStorage(os.environ.get("DATA_PATH", "storage.json"))
    goal_manager = GoalManager()
    stored_goals = store.load_goals()
    if not stored_goals:
        stored_goals = list(load_default_goals())
        if stored_goals:
            store.save_goals(stored_goals)
    for item in stored_goals:
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

    @app.post("/lesson/prompts")
    def lesson_prompts(data: LessonPromptsIn):
        prompts = generate_mcq_lesson(
            data.topic, data.new_words, data.review_words
        )
        return {"prompts": prompts}

    @app.post("/vocabulary")
    def vocabulary(data: VocabularyIn):
        with NamedTemporaryFile("w+", encoding="utf-8", delete=False) as tmp:
            tmp.write(data.corpus)
            tmp.flush()
            path = tmp.name
        try:
            words = extract_vocabulary(path)
        finally:
            os.unlink(path)
        return {"vocabulary": words}

    @app.post("/blurb")
    def blurb(data: BlurbIn):
        text = generate_blurb(
            data.known_words, data.l_plus_one_words, data.length
        )
        return {"blurb": text}

    @app.post("/blurb/llm")
    def blurb_llm(data: BlurbIn):
        text = generate_blurb(
            data.known_words,
            data.l_plus_one_words,
            data.length,
            use_llm=True,
        )
        return {"blurb": text}

    @app.get("/media")
    def media(word: str, level: int):
        return suggest_media(word, level)

    return app


app = create_app()
