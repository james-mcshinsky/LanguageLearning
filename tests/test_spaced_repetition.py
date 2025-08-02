from datetime import datetime, timedelta

from language_learning.spaced_repetition import SRSFilter, SpacedRepetitionScheduler


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
