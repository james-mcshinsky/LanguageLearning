"""Vocabulary extraction utilities."""

import csv
import re
from collections import Counter
from pathlib import Path
from typing import List, Optional

from .goals import GoalManager


class CorpusReadError(Exception):
    """Error raised when a corpus file cannot be read."""


def _load_coca_counts(coca_path: str) -> Counter:
    """Load COCA frequency data from a CSV file.

    The CSV file is expected to have two columns: ``word`` and ``frequency``.
    """

    counts: Counter = Counter()
    try:
        with open(coca_path, "r", encoding="utf-8") as f:
            reader = csv.reader(f)
            for row in reader:
                if len(row) < 2:
                    continue
                word, freq = row[0].strip().lower(), row[1].strip()
                try:
                    counts[word] += float(freq)
                except ValueError:
                    continue
    except FileNotFoundError:
        # Silently ignore missing COCA data; extraction can proceed without it.
        pass
    return counts


def extract_vocabulary(
    corpus_path: str,
    goals: Optional[GoalManager] = None,
    coca_path: Optional[str] = None,
) -> List[str]:
    """Extract words from a corpus ranked by goal-adjusted frequency.

    Parameters
    ----------
    corpus_path: str
        Path to a text corpus file.
    goals: Optional[GoalManager]
        Goals used to adjust word ranking. Words present in goals have
        their frequencies multiplied by the goal's weight.
    coca_path: Optional[str]
        Path to a CSV file containing COCA frequency data. If not provided,
        the function will attempt to load ``coca.csv`` located next to this
        module. Missing files are ignored gracefully.

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

    # Merge with COCA frequency data if available
    coca_file = (
        Path(coca_path)
        if coca_path
        else Path(__file__).with_name("coca.csv")
    )
    if coca_file.exists():
        coca_counts = _load_coca_counts(str(coca_file))
        # Only boost counts for words present in the corpus to avoid
        # introducing unrelated vocabulary from the COCA list.
        for word in list(counts.keys()):
            if word in coca_counts:
                counts[word] += coca_counts[word]

    # Adjust counts according to goal weights
    if goals:
        for item in goals.list_goals():
            if item.word in counts:
                counts[item.word] *= item.weight

    return sorted(counts.keys(), key=lambda w: (-counts[w], w))
