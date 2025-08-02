"""Vocabulary extraction utilities."""

import re
from collections import Counter
from typing import List, Optional

from .goals import GoalManager


class CorpusReadError(Exception):
    """Error raised when a corpus file cannot be read."""


def extract_vocabulary(corpus_path: str, goals: Optional[GoalManager] = None) -> List[str]:
    """Extract words from a corpus ranked by goal-adjusted frequency.

    Parameters
    ----------
    corpus_path: str
        Path to a text corpus file.
    goals: Optional[GoalManager]
        Goals used to adjust word ranking. Words present in goals have
        their frequencies multiplied by the goal's weight.

    Returns
    -------
    List[str]
        Words sorted by adjusted frequency (descending) and
        alphabetically for ties.

    Raises
    ------
    CorpusReadError
        If ``corpus_path`` cannot be opened or decoded as UTF-8.
    """
    try:
        with open(corpus_path, "r", encoding="utf-8") as f:
            text = f.read().lower()
    except FileNotFoundError as exc:
        raise CorpusReadError(f"Corpus file not found: {corpus_path}") from exc
    except UnicodeDecodeError as exc:
        raise CorpusReadError(
            f"Failed to decode corpus file as UTF-8: {corpus_path}"
        ) from exc
    words = re.findall(r"\b\w+\b", text)
    counts = Counter(words)
    if goals:
        for item in goals.list_goals():
            if item.word in counts:
                counts[item.word] *= item.weight
    return sorted(counts.keys(), key=lambda w: (-counts[w], w))
