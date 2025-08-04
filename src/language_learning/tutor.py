"""Lesson planning helpers combining goals and spaced repetition.

This module provides a small orchestration layer that selects which
vocabulary words to study and generates lesson items for them.  It relies on
``SRSFilter`` to decide which words are due for review and uses goal-ranked
vocabulary to introduce new items.  Lessons consist solely of multiple-choice
questions with occasional grammar tips as placeholders for future
micro-lessons.
"""

from __future__ import annotations

from itertools import zip_longest
import random
from typing import Dict, List, Tuple

from .spaced_repetition import SRSFilter
from .ai_lessons import _generate_distractors


def select_word_batch(
    goal_ranked_words: List[str],
    srs_filter: SRSFilter,
    new_word_limit: int = 3,
    review_limit: int = 5,
) -> Tuple[List[str], List[str]]:
    """Return lists of new and review words for the next lesson.

    ``goal_ranked_words`` should be ordered such that earlier entries are more
    relevant to the learner's current goal.  ``srs_filter`` tracks review
    scheduling.  New words are those with no prior repetitions in
    ``srs_filter`` while review words are drawn from the SRS queue based on
    when they are due.
    """

    review_words: List[str] = []
    seen: set[str] = set()
    for _ in range(review_limit):
        word = srs_filter.pop_next_due()
        if not word or word in seen:
            break
        seen.add(word)
        review_words.append(word)

    new_words: List[str] = []
    for word in goal_ranked_words:
        if len(new_words) >= new_word_limit:
            break
        sched = srs_filter.schedulers.get(word)
        if word in review_words:
            continue
        if not sched or sched.state.repetitions == 0:
            new_words.append(word)
    return new_words, review_words


def _mcq_item(word: str) -> Dict[str, object]:
    answer = f"meaning of {word}"
    choices = [answer] + _generate_distractors(word)
    random.shuffle(choices)
    return {
        "type": "mcq",
        "word": word,
        "question": f"What is the meaning of '{word}'?",
        "choices": choices,
        "answer": answer,
        "answer_index": choices.index(answer),
    }


def _grammar_tip(word: str) -> Dict[str, str]:
    return {
        "type": "grammar_tip",
        "tip": f"Remember the grammar rule associated with '{word}'.",
    }


def generate_tutor_lesson(
    goal_ranked_words: List[str],
    srs_filter: SRSFilter,
    new_word_limit: int = 3,
    review_limit: int = 5,
    grammar_every: int = 10,
) -> List[Dict[str, object]]:
    """Generate an interleaved lesson sequence.

    The function selects new and review words via :func:`select_word_batch`
    then interleaves their multiple-choice questions.  After every
    ``grammar_every`` new words a placeholder grammar tip is inserted.
    """

    new_words, review_words = select_word_batch(
        goal_ranked_words, srs_filter, new_word_limit, review_limit
    )

    lesson: List[Dict[str, object]] = []
    new_counter = 0
    for new_word, review_word in zip_longest(new_words, review_words):
        if new_word is not None:
            lesson.append(_mcq_item(new_word))
            new_counter += 1
            if grammar_every and new_counter % grammar_every == 0:
                lesson.append(_grammar_tip(new_word))
        if review_word is not None:
            lesson.append(_mcq_item(review_word))
    return lesson
