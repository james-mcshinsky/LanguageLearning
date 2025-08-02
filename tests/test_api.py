import json
from fastapi.testclient import TestClient

from language_learning.api import create_app
from language_learning.storage import JSONStorage


def _make_client(tmp_path):
    storage = JSONStorage(tmp_path / "data.json")
    app = create_app(storage)
    return TestClient(app), storage


def test_goal_setup_and_persistence(tmp_path):
    client, storage = _make_client(tmp_path)

    resp = client.post("/goals", json={"word": "hello"})
    assert resp.status_code == 200
    assert resp.json()["goals"][0]["word"] == "hello"

    resp = client.get("/goals")
    assert resp.status_code == 200
    assert resp.json()["goals"] == [{"word": "hello", "weight": 1.0}]

    with open(storage.path, "r", encoding="utf-8") as fh:
        data = json.load(fh)
    assert data["goals"][0]["word"] == "hello"


def test_lesson_and_media_endpoints(tmp_path):
    client, _ = _make_client(tmp_path)

    resp = client.get("/lesson", params={"topic": "travel"})
    assert resp.status_code == 200
    assert resp.json()["topic"] == "travel"

    resp = client.get("/media", params={"word": "word", "level": 1})
    assert resp.status_code == 200
    items = resp.json()
    assert items and all(item["level"] == 2 for item in items)
