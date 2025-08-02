"""Minimal spaced-repetition scheduler."""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timedelta
from typing import Dict, Optional
import json


@dataclass
class ReviewState:
    """Represents the review state of an item."""

    repetitions: int = 0
    interval: int = 0
    efactor: float = 2.5
    next_review: datetime = field(default_factory=datetime.now)


class SpacedRepetitionScheduler:
    """Implements a tiny variant of the SM-2 algorithm."""

    def __init__(self) -> None:
        self.state = ReviewState()

    def review(self, quality: int) -> datetime:
        """Update schedule based on *quality* (0-5) and return next review date."""
        if quality < 3:
            self.state.repetitions = 0
            self.state.interval = 1
        else:
            if self.state.repetitions == 0:
                self.state.interval = 1
            elif self.state.repetitions == 1:
                self.state.interval = 6
            else:
                self.state.interval = round(self.state.interval * self.state.efactor)
            self.state.repetitions += 1

        self.state.efactor = self.state.efactor + (
            0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)
        )
        if self.state.efactor < 1.3:
            self.state.efactor = 1.3

        self.state.next_review = datetime.now() + timedelta(days=self.state.interval)
        return self.state.next_review


class SRSFilter:
    """Manage multiple words and their review state.

    Each word has an associated :class:`SpacedRepetitionScheduler` and a
    ``goal_frequency_rank``.  Lower ranks indicate higher frequency.

    Items can be serialised to and from JSON using :meth:`save_state` and
    :meth:`load_state`.
    """

    def __init__(self, goal_frequency_ranks: Dict[str, int]) -> None:
        self.goal_frequency_ranks = goal_frequency_ranks
        self.schedulers: Dict[str, SpacedRepetitionScheduler] = {
            word: SpacedRepetitionScheduler() for word in goal_frequency_ranks
        }

    # ------------------------------------------------------------------
    # Persistence helpers
    def save_state(self, path: str) -> None:
        """Persist review state as JSON to *path*."""

        data: Dict[str, Dict[str, object]] = {}
        for word, scheduler in self.schedulers.items():
            st = scheduler.state
            data[word] = {
                "repetitions": st.repetitions,
                "interval": st.interval,
                "efactor": st.efactor,
                "next_review": st.next_review.isoformat(),
                "goal_frequency_rank": self.goal_frequency_ranks.get(word, 1),
            }
        with open(path, "w", encoding="utf-8") as fh:
            json.dump(data, fh)

    @classmethod
    def load_state(cls, path: str) -> "SRSFilter":
        """Load review state from *path* and return a new ``SRSFilter``."""

        with open(path, "r", encoding="utf-8") as fh:
            data = json.load(fh)
        ranks = {word: int(info["goal_frequency_rank"]) for word, info in data.items()}
        filt = cls(ranks)
        for word, info in data.items():
            st = filt.schedulers[word].state
            st.repetitions = int(info["repetitions"])
            st.interval = int(info["interval"])
            st.efactor = float(info["efactor"])
            st.next_review = datetime.fromisoformat(info["next_review"])
        return filt

    # ------------------------------------------------------------------
    # Review helpers
    def review(self, word: str, quality: int) -> datetime:
        """Review *word* with given *quality* using its scheduler."""

        return self.schedulers[word].review(quality)

    def _forgetting_probability(self, word: str, now: Optional[datetime] = None) -> float:
        """Compute a crude forgetting probability for *word*.

        The value is proportional to how overdue an item is: items not yet due
        have a probability of ``0`` while overdue items increase linearly with
        the number of days past ``next_review``.
        """

        sched = self.schedulers[word]
        now = now or datetime.now()
        overdue_seconds = (now - sched.state.next_review).total_seconds()
        if overdue_seconds <= 0:
            return 0.0
        interval = sched.state.interval or 1
        return overdue_seconds / 86400 / interval

    def pop_next_due(self) -> Optional[str]:
        """Return the next due word based on priority.

        Priority is calculated as ``forgetting_probability * goal_frequency``
        where ``goal_frequency`` is the reciprocal of ``goal_frequency_rank``.
        """

        now = datetime.now()
        best_word: Optional[str] = None
        best_score = -1.0
        for word in self.schedulers:
            fp = self._forgetting_probability(word, now)
            if fp <= 0:
                continue
            goal_freq = 1.0 / float(self.goal_frequency_ranks.get(word, 1))
            score = fp * goal_freq
            if score > best_score:
                best_score = score
                best_word = word
        return best_word


if __name__ == "__main__":  # pragma: no cover - example usage
    scheduler = SpacedRepetitionScheduler()
    for q in [5, 5, 3, 4]:
        nxt = scheduler.review(q)
        print(
            f"Quality {q} -> next review on {nxt.date()}, interval {scheduler.state.interval} days"
        )
