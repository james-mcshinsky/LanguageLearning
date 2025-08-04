from language_learning.media_integration import (
    suggest_media,
    record_media_interaction,
    interaction_queue,
)


def test_suggest_media_lplus1_filtering():
    results = suggest_media("you", 1)
    assert len(results) == 1
    item = results[0]
    assert item["level"] == 2
    # transcript is optional but present for the L+1 item in the catalogue
    assert "transcript" in item


def test_record_media_interaction_queueing():
    interaction_queue.clear()
    record_media_interaction("alice", "media1", "you")
    record_media_interaction("alice", "media2", "i")
    record_media_interaction("bob", "media3", "you")

    assert interaction_queue["alice"] == [
        ("media1", "you"),
        ("media2", "i"),
    ]
    assert interaction_queue["bob"] == [("media3", "you")]
