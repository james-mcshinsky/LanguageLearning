"""Generate short blurbs using restricted vocabulary.

This module provides both deterministic and LLM-backed generation strategies.
Environment variables can toggle between the two approaches.
"""

from typing import Iterable, List, Optional
import json
import os

import requests


def _generate_simple(
    known_words: Iterable[str],
    l_plus_one_words: Iterable[str],
    length: int,
) -> str:
    """Deterministic template-based blurb generator."""

    allowed = list(dict.fromkeys(list(l_plus_one_words) + list(known_words)))
    if length <= 0 or not allowed:
        return ""

    words: List[str] = []
    idx = 0
    while len(words) < length:
        words.append(allowed[idx % len(allowed)])
        idx += 1

    return " ".join(words)


def _generate_with_llm(
    known_words: Iterable[str],
    l_plus_one_words: Iterable[str],
    length: int,
) -> str:
    """Generate a blurb using an LLM with a restricted vocabulary."""

    allowed = list(dict.fromkeys(list(l_plus_one_words) + list(known_words)))
    if length <= 0 or not allowed:
        return ""

    endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
    deployment = os.getenv("AZURE_OPENAI_DEPLOYMENT")
    api_key = os.getenv("AZURE_OPENAI_API_KEY")
    if not (endpoint and deployment and api_key):
        raise RuntimeError("Azure OpenAI configuration missing")

    word_list = ", ".join(allowed)
    prompt = (
        f"Write a coherent {length}-word blurb using ONLY the following words: "
        f"{word_list}. Do not use any other vocabulary. Return just the blurb."
    )
    url = (
        f"{endpoint}/openai/deployments/{deployment}/chat/completions"
        "?api-version=2025-01-01-preview"
    )
    res = requests.post(
        url,
        headers={"api-key": api_key, "Content-Type": "application/json"},
        json={"messages": [{"role": "user", "content": prompt}]},
        timeout=15,
    )
    res.raise_for_status()
    content = res.json()["choices"][0]["message"]["content"].strip()
    words = content.split()
    if len(words) > length:
        content = " ".join(words[:length])
    return content


def generate_blurb(
    known_words: Iterable[str],
    l_plus_one_words: Iterable[str],
    length: int,
    use_llm: Optional[bool] = None,
) -> str:
    """Return a short blurb using only whitelisted vocabulary."""

    if use_llm is None:
        use_llm = os.getenv("USE_LLM_BLURB", "").lower() in {"1", "true", "yes"}

    if use_llm:
        try:
            return _generate_with_llm(known_words, l_plus_one_words, length)
        except Exception:
            pass
    return _generate_simple(known_words, l_plus_one_words, length)

