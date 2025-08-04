from datetime import datetime, timedelta

from language_learning.tutor import select_word_batch, generate_tutor_lesson
from language_learning.spaced_repetition import SRSFilter


def _build_filter(words):
    ranks = {w: i + 1 for i, w in enumerate(words)}
    return SRSFilter(ranks)


def test_select_word_batch_prioritises_goal_and_due():
    goal_words = ["alpha", "beta", "gamma", "delta"]
    filt = _build_filter(goal_words)
    # mark gamma as a due review
    st = filt.schedulers["gamma"].state
    st.repetitions = 1
    st.next_review = datetime.now() - timedelta(days=1)

    new_words, review_words = select_word_batch(goal_words, filt, 2, 2)
    assert review_words == ["gamma"]
    assert new_words == ["alpha", "beta"]


def test_generate_tutor_lesson_interleaves_and_inserts_grammar():
    goal_words = ["alpha", "beta"]
    filt = _build_filter(goal_words)
    st = filt.schedulers["beta"].state
    st.repetitions = 1
    st.next_review = datetime.now() - timedelta(days=1)

    lesson = generate_tutor_lesson(goal_words, filt, new_word_limit=1, review_limit=1, grammar_every=1)
    types = [item["type"] for item in lesson]
    assert types == ["mcq", "grammar_tip", "mcq"]
    words = [item["word"] for item in lesson if item["type"] == "mcq"]
    assert words == ["alpha", "beta"]
