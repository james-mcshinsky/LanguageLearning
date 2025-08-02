"""Core modules for LanguageLearning project."""

from .vocabulary import extract_vocabulary
from .spaced_repetition import SpacedRepetitionScheduler
from .ai_lessons import generate_lesson, generate_mcq_lesson
from .media_integration import record_media_interaction, suggest_media
from .ai_blurbs import generate_blurb

__all__ = [
    "extract_vocabulary",
    "SpacedRepetitionScheduler",
    "generate_lesson",
    "generate_mcq_lesson",
    "suggest_media",
    "record_media_interaction",
    "generate_blurb",
]
