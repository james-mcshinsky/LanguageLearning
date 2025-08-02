from language_learning.vocabulary import extract_vocabulary


def test_extract_vocabulary():
    text = "Hello hello world"
    assert extract_vocabulary(text) == ["hello", "world"]
