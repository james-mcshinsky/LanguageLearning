"""Minimal spaced-repetition scheduler."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timedelta


@dataclass
class ReviewState:
    """Represents the review state of an item."""

    repetitions: int = 0
    interval: int = 0
    efactor: float = 2.5
    next_review: datetime = datetime.now()


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


if __name__ == "__main__":  # pragma: no cover - example usage
    scheduler = SpacedRepetitionScheduler()
    for q in [5, 5, 3, 4]:
        nxt = scheduler.review(q)
        print(
            f"Quality {q} -> next review on {nxt.date()}, interval {scheduler.state.interval} days"
        )
