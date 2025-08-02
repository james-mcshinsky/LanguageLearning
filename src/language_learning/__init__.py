"""Core modules for LanguageLearning project."""

from .vocabulary import extract_vocabulary
from .spaced_repetition import SpacedRepetitionScheduler
from .ai_lessons import generate_lesson
from .media_integration import suggest_media

__all__ = [
    "extract_vocabulary",
    "SpacedRepetitionScheduler",
    "generate_lesson",
    "suggest_media",
]
