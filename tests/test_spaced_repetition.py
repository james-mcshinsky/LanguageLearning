from language_learning.spaced_repetition import SpacedRepetitionScheduler


def test_review_progress():
    scheduler = SpacedRepetitionScheduler()
    first = scheduler.review(5)
    second = scheduler.review(5)
    assert scheduler.state.repetitions == 2
    assert scheduler.state.interval >= 1
    assert second > first
