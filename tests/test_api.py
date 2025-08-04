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
    assert len(goals) == 6

    with open(storage.path, "r", encoding="utf-8") as fh:
        data = json.load(fh)
    assert any(g["word"] == "hello" and not g.get("is_default") for g in data["goals"])


def test_create_app_loads_default_goals(tmp_path):
    """Ensure the application loads bundled COCA goals on first run."""
    client, _ = _make_client(tmp_path)

    resp = client.get("/goals")
    assert resp.status_code == 200
    goals = resp.json()["goals"]
    assert len(goals) == 5
    assert all(g.get("is_default") for g in goals)


def test_lesson_and_media_endpoints(tmp_path):
    client, _ = _make_client(tmp_path)

    resp = client.get("/lesson", params={"topic": "travel"})
    assert resp.status_code == 200
    data = resp.json()
    assert data["topic"] == "travel"
    assert data["vocabulary"] == get_top_coca_words()

    resp = client.get("/media", params={"word": "you", "level": 1})
    assert resp.status_code == 200
    items = resp.json()
    assert items and all(item["level"] == 2 for item in items)


def test_lesson_prompts_default_words(tmp_path):
    client, _ = _make_client(tmp_path)

    resp = client.post("/lesson/prompts", json={"topic": "basics"})
    assert resp.status_code == 200
    prompts = resp.json()["prompts"]
    mcq_words = [p["word"] for p in prompts if p["type"] == "mcq"]
    expected: list[str] = []
    for w in get_top_coca_words():
        expected.extend([w, w])
    assert mcq_words == expected


def test_blurb_defaults_to_coca(tmp_path):
    client, _ = _make_client(tmp_path)

    resp = client.post(
        "/blurb", json={"known_words": [], "l_plus_one_words": [], "length": 3}
    )
    assert resp.status_code == 200
    words = resp.json()["blurb"].split()
    assert words == get_top_coca_words(3)


def test_cors_headers(tmp_path):
    """The API should expose permissive CORS headers for browser clients."""
    client, _ = _make_client(tmp_path)

    resp = client.options(
        "/media",
        headers={
            "Origin": "http://example.com",
            "Access-Control-Request-Method": "GET",
        },
    )
    assert resp.status_code == 200
    # Ensure the CORS middleware set the appropriate header
    assert resp.headers.get("access-control-allow-origin") == "*"
