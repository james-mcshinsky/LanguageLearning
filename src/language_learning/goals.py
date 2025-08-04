"""Goal management utilities."""

from dataclasses import dataclass
from pathlib import Path
import csv
from typing import Dict, Iterable, Iterator, List, Optional


@dataclass
class GoalItem:
    word: str
    weight: float = 1.0
    is_default: bool = False


class GoalManager:
    """In-memory CRUD store for GoalItem instances."""

    def __init__(self) -> None:
        self._goals: Dict[str, GoalItem] = {}

    def create_goal(self, item: GoalItem) -> None:
        """Create or replace a goal."""
        self._goals[item.word] = item

    def read_goal(self, word: str) -> Optional[GoalItem]:
        """Retrieve a goal by word."""
        return self._goals.get(word)

    def update_goal(self, word: str, weight: float) -> None:
        """Update weight for a goal."""
        if word in self._goals:
            self._goals[word].weight = weight

    def delete_goal(self, word: str) -> None:
        """Delete goal by word."""
        self._goals.pop(word, None)

    def list_goals(self) -> List[GoalItem]:
        """Return list of all goals."""
        return list(self._goals.values())


def load_default_goals(limit: int = 5) -> Iterator[GoalItem]:
    """Yield the top ``limit`` goals from the bundled COCA frequency list."""

    path = Path(__file__).with_name("coca.csv")
    with path.open("r", encoding="utf-8", newline="") as fh:
        reader = csv.reader(fh)
        for i, row in enumerate(reader):
            if i >= limit:
                break
            if not row:
                continue
            word = row[0].strip()
            try:
                weight = float(row[1]) if len(row) > 1 and row[1] else 1.0
            except ValueError:
                weight = 1.0
            yield GoalItem(word=word, weight=weight, is_default=True)
