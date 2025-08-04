from datetime import datetime, timedelta

import pytest

from language_learning.spaced_repetition import (
    SRSFilter,
    SpacedRepetitionScheduler,
    default_srs_filter,
)
from language_learning.vocabulary import get_top_coca_words


def test_review_progress():
    scheduler = SpacedRepetitionScheduler()
    first = scheduler.review(5)
    second = scheduler.review(5)
    assert scheduler.state.repetitions == 2
    assert scheduler.state.interval >= 1
    assert second > first


def test_srs_filter_pop_and_persistence(tmp_path):
    ranks = {"apple": 1, "banana": 2, "carrot": 3}
    filt = SRSFilter(ranks)

    now = datetime.now()
    # Make apple and banana overdue by different amounts
    filt.schedulers["apple"].state.next_review = now - timedelta(days=2)
    filt.schedulers["banana"].state.next_review = now - timedelta(days=1)
    # Set intervals to avoid divide-by-zero when computing forgetting probability
    filt.schedulers["apple"].state.interval = 1
    filt.schedulers["banana"].state.interval = 1
    filt.schedulers["carrot"].state.interval = 1
    filt.schedulers["carrot"].state.next_review = now + timedelta(days=1)

    assert filt.pop_next_due() == "apple"

    # After reviewing apple it's no longer due; banana should be next
    filt.review("apple", 5)
    assert filt.pop_next_due() == "banana"

    # Save and reload state; banana should remain next due
    path = tmp_path / "state.json"
    filt.save_state(path)
    loaded = SRSFilter.load_state(path)
    assert loaded.pop_next_due() == "banana"


def test_load_state_missing_file_returns_default(tmp_path):
    path = tmp_path / "missing.json"
    filt = SRSFilter.load_state(path)
    words = get_top_coca_words()
    assert list(filt.goal_frequency_ranks.keys()) == words
    for rank, word in enumerate(words, start=1):
        assert filt.goal_frequency_ranks[word] == rank


def test_default_srs_filter_contains_top_words():
    filt = default_srs_filter()
    words = get_top_coca_words()
    assert list(filt.goal_frequency_ranks.keys()) == words
    for rank, word in enumerate(words, start=1):
        assert filt.goal_frequency_ranks[word] == rank


def test_load_state_invalid_json_raises(tmp_path):
    path = tmp_path / "bad.json"
    path.write_text("{not valid json", encoding="utf-8")
    with pytest.raises(ValueError):
        SRSFilter.load_state(path)
