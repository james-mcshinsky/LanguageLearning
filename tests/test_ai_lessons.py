from language_learning.ai_lessons import generate_lesson


def test_generate_lesson():
    lesson = generate_lesson("food", ["apple"])
    assert lesson["topic"] == "food"
    assert "apple" in lesson["vocabulary"]
