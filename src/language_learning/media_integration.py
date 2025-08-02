"""Basic media suggestion utilities."""

from typing import Dict


def suggest_media(word: str) -> Dict[str, str]:
    """Return placeholder media links for *word*."""
    base = "https://example.com/media"
    return {
        "audio": f"{base}/{word}.mp3",
        "video": f"{base}/{word}.mp4",
        "image": f"{base}/{word}.jpg",
    }


if __name__ == "__main__":  # pragma: no cover - example usage
    sample = suggest_media("language")
    print(sample)
