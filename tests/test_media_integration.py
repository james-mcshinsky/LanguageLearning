from language_learning.media_integration import suggest_media


def test_suggest_media():
    media = suggest_media("word")
    assert media["audio"].endswith("word.mp3")
    assert media["video"].endswith("word.mp4")
    assert media["image"].endswith("word.jpg")
