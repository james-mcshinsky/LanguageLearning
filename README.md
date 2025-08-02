# LanguageLearning

**This project is private and proprietary.**

## Project Description

LanguageLearning provides resources and example code for building tools that make learning new languages more engaging. The repository now includes modular components for vocabulary extraction, spaced-repetition scheduling, AI-driven lesson generation, and basic media integration.

## Setup Requirements

To get started, you will need:

- Python 3.10+
- `pip` for managing packages

Create a virtual environment and install dependencies:

```bash
python -m venv .venv
source .venv/bin/activate  # On Windows use: .venv\Scripts\activate
pip install -r requirements.txt
```

### Dependencies

This project manages packages with `requirements.txt`. Key libraries include:

- `openai` for AI-driven lesson generation
- `nltk` for basic natural language processing
- `spacy` for advanced language processing
- `requests` for media and API integration
- `pytest` for running the test suite

## Usage Examples

Each module includes a small example when executed directly:

```bash
PYTHONPATH=src python -m language_learning.vocabulary
PYTHONPATH=src python -m language_learning.spaced_repetition
PYTHONPATH=src python -m language_learning.ai_lessons
PYTHONPATH=src python -m language_learning.media_integration
```

You can also import the modules in your own scripts:

```python
from language_learning import (
    extract_vocabulary,
    SpacedRepetitionScheduler,
    generate_lesson,
    suggest_media,
)
```

## Running Tests

This project uses [`pytest`](https://docs.pytest.org/) for its unit tests. The
tests reside in the `tests/` directory. After installing the dependencies, run
the entire test suite with:

```bash
pytest
```

## Contribution Guidelines

This project is private and does not accept external contributions.
