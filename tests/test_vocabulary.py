import pytest

from language_learning import get_top_coca_words
from language_learning.vocabulary import CorpusReadError, extract_vocabulary
from language_learning.goals import GoalManager, GoalItem


def test_extract_vocabulary_ranking(tmp_path):
    corpus = tmp_path / "corpus.txt"
    corpus.write_text("hello world world")
    # Default COCA data ranks "hello" above "world" despite corpus counts
    assert extract_vocabulary(str(corpus)) == ["hello", "world"]


def test_extract_vocabulary_with_goals(tmp_path):
    corpus = tmp_path / "corpus.txt"
    corpus.write_text("hello world world")
    manager = GoalManager()
    manager.create_goal(GoalItem(word="hello", weight=5))
    ranked = extract_vocabulary(str(corpus), manager)
    assert ranked[0] == "hello"


def test_extract_vocabulary_missing_file(tmp_path):
    missing = tmp_path / "missing.txt"
    with pytest.raises(CorpusReadError):
        extract_vocabulary(str(missing))


def test_extract_vocabulary_bad_encoding(tmp_path):
    bad = tmp_path / "bad.txt"
    bad.write_bytes(b"\xff\xfe\xfd")
    with pytest.raises(CorpusReadError):
        extract_vocabulary(str(bad))


def test_extract_vocabulary_with_coca_merge(tmp_path):
    corpus = tmp_path / "corpus.txt"
    corpus.write_text("alpha beta beta")
    coca = tmp_path / "coca.csv"
    coca.write_text("alpha,100\nbeta,1\n")
    ranked = extract_vocabulary(str(corpus), coca_path=str(coca))
    assert ranked == ["alpha", "beta"]


def test_extract_vocabulary_goal_weight_with_coca(tmp_path):
    corpus = tmp_path / "corpus.txt"
    corpus.write_text("alpha beta beta")
    coca = tmp_path / "coca.csv"
    coca.write_text("alpha,100\nbeta,1\n")
    manager = GoalManager()
    manager.create_goal(GoalItem(word="beta", weight=200))
    ranked = extract_vocabulary(str(corpus), manager, coca_path=str(coca))
    assert ranked[0] == "beta"


def test_get_top_coca_words():
    assert get_top_coca_words(3) == ["you", "i", "the"]
