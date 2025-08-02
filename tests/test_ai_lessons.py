from language_learning.ai_lessons import generate_lesson, generate_mcq_lesson


def test_generate_lesson():
    lesson = generate_lesson("food", ["apple"])
    assert lesson["topic"] == "food"
    assert "apple" in lesson["vocabulary"]


def test_generate_mcq_lesson_interleaves_and_has_grammar():
    lesson = generate_mcq_lesson(
        "greetings",
        new_words=["hola", "adios"],
        review_words=["gracias", "por favor"],
    )

    types = [item["type"] for item in lesson]
    for i in range(0, len(types), 2):
        assert types[i] == "mcq"
        assert types[i + 1] == "grammar_tip"

    mcq_words = [item["word"] for item in lesson if item["type"] == "mcq"]
    assert mcq_words == ["hola", "gracias", "adios", "por favor"]

    assert any(item["type"] == "grammar_tip" for item in lesson)
