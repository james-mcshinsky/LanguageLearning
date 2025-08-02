from language_learning.vocabulary import extract_vocabulary
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
