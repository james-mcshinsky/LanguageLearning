from language_learning import (
    extract_vocabulary,
    SpacedRepetitionScheduler,
    generate_lesson,
    suggest_media,
)


def test_package_exports(tmp_path):
    """Package-level imports should be available and functional."""
    corpus = tmp_path / "corpus.txt"
    corpus.write_text("hello world")
    assert extract_vocabulary(str(corpus)) == ["hello", "world"]

    scheduler = SpacedRepetitionScheduler()
    first = scheduler.review(5)
    assert scheduler.state.repetitions == 1

    lesson = generate_lesson("food", ["apple"])
    assert lesson["topic"] == "food"
    assert "apple" in lesson["vocabulary"]

    media = suggest_media("you", 1)
    assert media and media[0]["audio"].endswith("you_level2.mp3")
