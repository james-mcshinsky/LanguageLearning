import json
from fastapi.testclient import TestClient

from language_learning.api import create_app
from language_learning.storage import JSONStorage
from language_learning.vocabulary import get_top_coca_words


def _make_client(tmp_path):
    storage = JSONStorage(tmp_path / "store.json")
    app = create_app(storage)
    return TestClient(app), storage


def test_goal_setup_and_persistence(tmp_path):
    client, storage = _make_client(tmp_path)

    resp = client.post("/goals", json={"word": "hello"})
    assert resp.status_code == 200
    goals = resp.json()["goals"]
    assert any(g["word"] == "hello" for g in goals)

    resp = client.get("/goals")
    assert resp.status_code == 200
    goals = resp.json()["goals"]
    assert any(g["word"] == "hello" and not g.get("is_default") for g in goals)
    assert len(goals) == 650

    with open(storage.path, "r", encoding="utf-8") as fh:
        data = json.load(fh)
    assert any(g["word"] == "hello" and not g.get("is_default") for g in data["goals"])


def test_create_app_loads_default_goals(tmp_path):
    """Ensure the application loads bundled COCA goals on first run."""
    client, _ = _make_client(tmp_path)

    resp = client.get("/goals")
    assert resp.status_code == 200
    goals = resp.json()["goals"]
    assert len(goals) == 650
    assert all(g.get("is_default") for g in goals)


def test_lesson_and_media_endpoints(tmp_path):
    client, _ = _make_client(tmp_path)

    resp = client.get("/lesson", params={"topic": "travel"})
    assert resp.status_code == 200
    assert resp.json()["topic"] == "travel"

    resp = client.get("/media", params={"word": "word", "level": 1})
    assert resp.status_code == 200
    items = resp.json()
    assert items and all(item["level"] == 2 for item in items)


def test_blurb_defaults_to_coca(tmp_path):
    client, _ = _make_client(tmp_path)

    resp = client.post("/blurb", json={"length": 3})
    assert resp.status_code == 200
    words = resp.json()["blurb"].split()
    assert words == get_top_coca_words(3)
