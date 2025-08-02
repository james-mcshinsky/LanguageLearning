"""Stub for AI-driven lesson generation."""

from typing import Dict, List, Optional


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


if __name__ == "__main__":  # pragma: no cover - example usage
    sample = generate_lesson("travel", ["ticket", "airport"])
    print(sample)
