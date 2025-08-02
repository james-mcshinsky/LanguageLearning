import pytest

from language_learning.ai_blurbs import generate_blurb


def test_generate_blurb_restricts_vocabulary():
    known = ["chat", "chien"]
    l_plus = ["cheval"]
    blurb = generate_blurb(known, l_plus, length=5)
    words = blurb.split()
    allowed = set(known + l_plus)
    assert all(word in allowed for word in words)


def test_generate_blurb_length_control():
    known = ["hola"]
    l_plus = ["bonjour"]
    length = 3
    blurb = generate_blurb(known, l_plus, length)
    assert len(blurb.split()) == length
