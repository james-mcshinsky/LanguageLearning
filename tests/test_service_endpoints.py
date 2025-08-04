from datetime import datetime, timedelta

from language_learning.goals import GoalItem, load_default_goals
from language_learning.spaced_repetition import SRSFilter, SpacedRepetitionScheduler
from language_learning.storage import JSONStorage


def _compute_lesson_queue(goals, defaults, review):
    """Python port of the lesson service queue generation."""

    custom = [g for g in goals if not g.is_default]
    active = custom if custom else [GoalItem(word=w) for w in defaults]

    goal_ranks = {w: i + 1 for i, w in enumerate(defaults)}
    for i, g in enumerate(active):
        goal_ranks[g.word] = i + 1

    filt = SRSFilter(goal_ranks)
    for word, info in review.items():
        st = filt.schedulers.setdefault(word, SpacedRepetitionScheduler()).state
        st.repetitions = int(info.get("repetitions", 0))
        st.interval = int(info.get("interval", 0))
        st.efactor = float(info.get("efactor", 2.5))
        st.next_review = datetime.fromisoformat(info["next_review"])

    review_words = []
    visible = {g.word for g in active}
    while True:
        nxt = filt.pop_next_due()
        if not nxt:
            break
        if visible and nxt not in visible:
            del filt.schedulers[nxt]
            continue
        review_words.append(nxt)
        del filt.schedulers[nxt]

    new_words = [
        g.word
        for g in active
        if g.word not in review or review[g.word].get("repetitions", 0) == 0
    ]
    new_words = [w for w in new_words if w not in review_words][:3]
    return list(dict.fromkeys(new_words + review_words))


def _compute_next_reviews(goals, defaults, review):
    """Python port of the analytics service next-review calculation."""

    custom = [g for g in goals if not g.is_default]
    active = custom if custom else [GoalItem(word=w) for w in defaults]

    goal_ranks = {w: i + 1 for i, w in enumerate(defaults)}
    for i, g in enumerate(active):
        goal_ranks[g.word] = i + 1

    filt = SRSFilter(goal_ranks)
    for word, info in review.items():
        st = filt.schedulers.setdefault(word, SpacedRepetitionScheduler()).state
        st.repetitions = int(info.get("repetitions", 0))
        st.interval = int(info.get("interval", 0))
        st.efactor = float(info.get("efactor", 2.5))
        st.next_review = datetime.fromisoformat(info["next_review"])

    visible = {g.word for g in active}
    next_words = []
    for _ in range(5):
        nxt = filt.pop_next_due()
        if not nxt:
            break
        if visible and nxt not in visible:
            del filt.schedulers[nxt]
            continue
        next_words.append(nxt)
        del filt.schedulers[nxt]
    return next_words


def test_user_goals_override_defaults_but_review_state_persists(tmp_path):
    storage = JSONStorage(tmp_path / "store.json")

    defaults = list(load_default_goals())
    default_word = defaults[0].word
    custom_goals = [GoalItem("alpha"), GoalItem("beta")]
    storage.save_goals(defaults + custom_goals)

    now = datetime.now() - timedelta(days=1)
    review_state = {
        default_word: {
            "repetitions": 1,
            "interval": 1,
            "efactor": 2.5,
            "next_review": now.isoformat(),
        },
        "alpha": {
            "repetitions": 1,
            "interval": 1,
            "efactor": 2.5,
            "next_review": now.isoformat(),
        },
    }
    storage.save_review_state(review_state)

    goals = storage.load_goals()
    defaults_words = [g.word for g in defaults]
    review = storage.load_review_state()

    queue = _compute_lesson_queue(goals, defaults_words, review)
    next_reviews = _compute_next_reviews(goals, defaults_words, review)

    assert set(queue) == {"alpha", "beta"}
    assert default_word not in queue
    assert set(next_reviews) == {"alpha", "beta"}
    assert default_word not in next_reviews

    # review state remains intact for default words
    persisted = storage.load_review_state()
    assert default_word in persisted and "alpha" in persisted

