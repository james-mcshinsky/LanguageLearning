"""Generate short blurbs using restricted vocabulary.

This module currently implements a deterministic, template-based approach for
producing short text snippets that only use words from a provided whitelist.
A private ``_generate_with_llm`` function serves as a placeholder for future
large language model integration.
"""

from typing import Iterable, List


def generate_blurb(
    known_words: Iterable[str],
    l_plus_one_words: Iterable[str],
    length: int,
) -> str:
    """Return a short blurb using only whitelisted vocabulary.

    Parameters
    ----------
    known_words:
        Iterable of words already known by the learner.
    l_plus_one_words:
        Iterable of new words (``L+1`` vocabulary) to introduce.
    length:
        Desired length of the blurb measured in number of words.  If ``length``
        is less than one, an empty string is returned.
    """
    allowed = list(dict.fromkeys(list(l_plus_one_words) + list(known_words)))
    if length <= 0 or not allowed:
        return ""

    words: List[str] = []
    idx = 0
    while len(words) < length:
        words.append(allowed[idx % len(allowed)])
        idx += 1

    return " ".join(words)


def _generate_with_llm(*args, **kwargs) -> str:  # pragma: no cover - stub
    """Placeholder for future LLM-based generation."""
    raise NotImplementedError("LLM integration not yet implemented")

