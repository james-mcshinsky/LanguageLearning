"""Vocabulary extraction utilities."""

import re
from collections import Counter
from typing import List, Optional

from .goals import GoalManager


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
    """
    with open(corpus_path, "r", encoding="utf-8") as f:
        text = f.read().lower()
    words = re.findall(r"\b\w+\b", text)
    counts = Counter(words)
    if goals:
        for item in goals.list_goals():
            if item.word in counts:
                counts[item.word] *= item.weight
    return sorted(counts.keys(), key=lambda w: (-counts[w], w))
