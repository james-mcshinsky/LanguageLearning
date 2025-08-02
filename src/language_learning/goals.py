"""Goal management utilities."""

from dataclasses import dataclass
from typing import Dict, List, Optional


@dataclass
class GoalItem:
    word: str
    weight: float = 1.0


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
