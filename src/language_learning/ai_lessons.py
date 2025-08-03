"""Minimal helpers for AI-driven lesson generation."""

from typing import Dict, List, Optional
import json
import os
import random

import requests


def generate_lesson(topic: str, vocabulary: Optional[List[str]] = None) -> Dict[str, object]:
    """Return a minimal lesson plan for *topic*.

    Parameters
    ----------
    topic: str
        Subject of the lesson.
    vocabulary: list[str], optional
        Vocabulary words to highlight.
    """
    lesson = {
        "topic": topic,
        "introduction": f"Today's lesson covers {topic}.",
        "vocabulary": vocabulary or [],
        "exercise": f"Use {topic} in a sentence.",
    }
    return lesson


def _generate_distractors_llm(word: str) -> List[str]:
    """Return distractors for *word* using an LLM service."""

    endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
    deployment = os.getenv("AZURE_OPENAI_DEPLOYMENT")
    api_key = os.getenv("AZURE_OPENAI_API_KEY")
    if not (endpoint and deployment and api_key):
        raise RuntimeError("Azure OpenAI configuration missing")

    url = (
        f"{endpoint}/openai/deployments/{deployment}/chat/completions"
        "?api-version=2025-01-01-preview"
    )
    prompt = (
        "Provide three plausible but incorrect distractor answers for a "
        f"vocabulary question about the word '{word}'. Return the answers as a "
        "JSON array of strings."
    )
    res = requests.post(
        url,
        headers={"api-key": api_key, "Content-Type": "application/json"},
        json={"messages": [{"role": "user", "content": prompt}]},
        timeout=15,
    )
    res.raise_for_status()
    content = res.json()["choices"][0]["message"]["content"]
    return json.loads(content)


def _generate_distractors_simple(word: str) -> List[str]:
    """Deterministic placeholder distractors for *word*."""

    return [f"{word}_{suffix}" for suffix in ("a", "b", "c")]


def _generate_distractors(word: str) -> List[str]:
    """Return distractors for *word*, optionally using an LLM service."""

    if os.getenv("USE_LLM_DISTRACTORS", "").lower() in {"1", "true", "yes"}:
        try:
            return _generate_distractors_llm(word)
        except Exception:
            pass
    return _generate_distractors_simple(word)


def generate_mcq_lesson(
    topic: str, new_words: List[str], review_words: List[str]
) -> List[Dict[str, object]]:
    """Return a sequence of MCQ prompts and grammar micro-lessons.

    The resulting lesson alternates between multiple-choice questions for new
    and review vocabulary and simple grammar tips.  Each word yields an MCQ
    followed by a grammar hint.  ``new_words`` and ``review_words`` are
    interleaved so that learners constantly revisit prior material while
    encountering new vocabulary.
    """

    def mcq_entry(word: str) -> Dict[str, object]:
        answer = f"meaning of {word}"
        choices = [answer] + _generate_distractors(word)
        random.shuffle(choices)
        return {
            "type": "mcq",
            "word": word,
            "question": f"What is the meaning of '{word}'?",
            "choices": choices,
            "answer": answer,
            "answer_index": choices.index(answer),
        }

    def grammar_entry(word: str) -> Dict[str, str]:
        return {
            "type": "grammar_tip",
            "tip": f"Remember the grammar rule associated with '{word}'.",
        }

    lesson: List[Dict[str, object]] = []
    max_len = max(len(new_words), len(review_words))
    for i in range(max_len):
        if i < len(new_words):
            word = new_words[i]
            lesson.append(mcq_entry(word))
            lesson.append(grammar_entry(word))
        if i < len(review_words):
            word = review_words[i]
            lesson.append(mcq_entry(word))
            lesson.append(grammar_entry(word))
    return lesson


if __name__ == "__main__":  # pragma: no cover - example usage
    sample = generate_lesson("travel", ["ticket", "airport"])
    print(sample)
