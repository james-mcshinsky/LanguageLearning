from language_learning import (
    extract_vocabulary,
    SpacedRepetitionScheduler,
    generate_lesson,
    suggest_media,
)


def test_package_exports():
    """Package-level imports should be available and functional."""
    assert extract_vocabulary("hello world") == ["hello", "world"]

    scheduler = SpacedRepetitionScheduler()
    first = scheduler.review(5)
    assert scheduler.state.repetitions == 1

    lesson = generate_lesson("food", ["apple"])
    assert lesson["topic"] == "food"
    assert "apple" in lesson["vocabulary"]

    media = suggest_media("word")
    assert media["audio"].endswith("word.mp3")
