import pytest

from language_learning.vocabulary import CorpusReadError, extract_vocabulary
from language_learning.goals import GoalManager, GoalItem


def test_extract_vocabulary_ranking(tmp_path):
    corpus = tmp_path / "corpus.txt"
    corpus.write_text("hello world world")
    assert extract_vocabulary(str(corpus)) == ["world", "hello"]


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
