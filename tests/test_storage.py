import os
from language_learning.storage import JSONStorage


def test_read_corrupt_json_returns_empty(tmp_path):
    path = tmp_path / "store.json"
    path.write_text("{not valid}", encoding="utf-8")
    store = JSONStorage(path)
    assert store.load_user() is None
    assert store.load_goals() == []
    assert store.load_review_state() == {}


def test_read_uses_backup_on_decode_error(tmp_path):
    store = JSONStorage(tmp_path / "store.json")
    store.save_user({"name": "Alice"})
    store.save_user({"name": "Bob"})
    # At this point a backup containing the first user should exist
    backup_path = f"{store.path}.bak"
    assert os.path.exists(backup_path)
    # Corrupt the main file
    with open(store.path, "w", encoding="utf-8") as fh:
        fh.write("{invalid}")
    user = store.load_user()
    assert user == {"name": "Alice"}
