"""Media suggestion and interaction tracking utilities."""

from __future__ import annotations

from collections import defaultdict
from typing import Dict, List, Tuple


# ---------------------------------------------------------------------------
# Example media catalogue used for tests and demonstrations.
_BASE = "https://example.com/media"
_MEDIA_LIBRARY: Dict[str, List[Dict[str, str]]] = {
    # Each word has media items at various difficulty levels.  Only the
    # L+1 level items should be returned by :func:`suggest_media`.
    "word": [
        {
            "id": "word_lvl1",
            "level": 1,
            "audio": f"{_BASE}/word_level1.mp3",
            "video": f"{_BASE}/word_level1.mp4",
            "image": f"{_BASE}/word_level1.jpg",
        },
        {
            "id": "word_lvl2",
            "level": 2,
            "audio": f"{_BASE}/word_level2.mp3",
            "video": f"{_BASE}/word_level2.mp4",
            "image": f"{_BASE}/word_level2.jpg",
            "transcript": "Example transcript for level 2 media.",
        },
        {
            "id": "word_lvl3",
            "level": 3,
            "audio": f"{_BASE}/word_level3.mp3",
            "video": f"{_BASE}/word_level3.mp4",
            "image": f"{_BASE}/word_level3.jpg",
        },
    ],
    "another": [
        {
            "id": "another_lvl2",
            "level": 2,
            "audio": f"{_BASE}/another_level2.mp3",
            "video": f"{_BASE}/another_level2.mp4",
            "image": f"{_BASE}/another_level2.jpg",
        }
    ],
}

# ---------------------------------------------------------------------------
# Interaction queue handling
# ``interaction_queue`` maps user IDs to a list of ``(media_id, word)`` tuples.
interaction_queue: Dict[str, List[Tuple[str, str]]] = defaultdict(list)


def suggest_media(word: str, level: int) -> List[Dict[str, str]]:
    """Return media entries for *word* at the learner's ``L+1`` difficulty.

    Parameters
    ----------
    word:
        Vocabulary item for which media is requested.
    level:
        Current learner difficulty level.  Only media at ``level + 1`` are
        returned.

    Returns
    -------
    List[Dict[str, str]]
        Media items matching the requested word filtered to the ``L+1`` level.
        Each item may contain an optional ``transcript`` key in addition to
        the media URLs.
    """

    target = level + 1
    return [
        item for item in _MEDIA_LIBRARY.get(word, []) if item.get("level") == target
    ]


def record_media_interaction(user_id: str, media_id: str, word: str) -> None:
    """Store that ``user_id`` interacted with ``word`` in ``media_id``.

    The interactions are appended to :data:`interaction_queue` for later spaced
    repetition review.
    """

    interaction_queue[user_id].append((media_id, word))


if __name__ == "__main__":  # pragma: no cover - example usage
    # Demonstrate media suggestion and interaction recording
    items = suggest_media("word", 1)
    for entry in items:
        print(entry)
    record_media_interaction("demo_user", items[0]["id"], "word")
    print(dict(interaction_queue))
