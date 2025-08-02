"""Simple vocabulary extraction utilities."""

import re
from typing import List


def extract_vocabulary(text: str) -> List[str]:
    """Extract a sorted list of unique words from *text*.

    Parameters
    ----------
    text: str
        Input text to scan.

    Returns
    -------
    List[str]
        Sorted list of distinct words in lowercase.
    """
    words = re.findall(r"\b\w+\b", text.lower())
    return sorted(set(words))


if __name__ == "__main__":  # pragma: no cover - example usage
    sample = "Hello world! Hello AI."
    print(extract_vocabulary(sample))
