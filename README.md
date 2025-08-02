# LanguageLearning

## Project Description

LanguageLearning provides resources and example code for building tools that make learning new languages more engaging. The repository now includes modular components for vocabulary extraction, spaced-repetition scheduling, AI-driven lesson generation, and basic media integration.

## Setup Requirements

To get started, you will need:

- Python 3.10+
- `pip` for managing packages

Clone the repository and install dependencies:

```bash
git clone https://github.com/example/LanguageLearning.git
cd LanguageLearning
pip install -r requirements.txt
```

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

Run the basic test suite to see the modules in action:

```bash
PYTHONPATH=src pytest
```

## Contribution Guidelines

Contributions are welcome! To contribute:

1. Fork the repository and create a new branch for your feature or bug fix.
2. Make your changes and ensure existing tests pass by running `pytest`.
3. Submit a pull request with a clear description of your changes.

Please adhere to standard coding conventions and write tests for any new functionality.
