import json
import sys
from datetime import datetime

from .goals import GoalManager, GoalItem, load_default_goals
from .vocabulary import extract_vocabulary
from .spaced_repetition import SRSFilter, SpacedRepetitionScheduler
from .ai_lessons import generate_lesson, generate_mcq_lesson
from .media_integration import suggest_media, record_media_interaction
from .ai_blurbs import generate_blurb


def vocabulary(goals_json: str, corpus_path: str) -> None:
    goals = json.loads(goals_json)
    manager = GoalManager()
    for g in goals:
        manager.create_goal(GoalItem(g["word"], float(g.get("weight", 1))))
    vocab = extract_vocabulary(corpus_path, manager)
    print(json.dumps({"vocab": vocab}))


def lesson_queue(goal_ranks_json: str, goals_json: str, review_json: str) -> None:
    goal_ranks = json.loads(goal_ranks_json)
    goals = json.loads(goals_json)
    review = json.loads(review_json)
    visible_words = {g["word"] for g in goals}
    filt = SRSFilter(goal_ranks)
    for word, info in review.items():
        st = filt.schedulers.setdefault(word, SpacedRepetitionScheduler()).state
        st.repetitions = int(info.get("repetitions", 0))
        st.interval = int(info.get("interval", 0))
        st.efactor = float(info.get("efactor", 2.5))
        st.next_review = datetime.fromisoformat(info["next_review"])
    review_words: list[str] = []
    while True:
        nxt = filt.pop_next_due()
        if not nxt:
            break
        if visible_words and nxt not in visible_words:
            del filt.schedulers[nxt]
            continue
        review_words.append(nxt)
        del filt.schedulers[nxt]
    new_words = [
        g["word"]
        for g in goals
        if g["word"] not in review or review[g["word"]].get("repetitions", 0) == 0
    ]
    new_words = [w for w in new_words if w not in review_words][:3]
    lesson = generate_mcq_lesson("practice", new_words, review_words)
    print(json.dumps({"lesson": lesson, "words": list(dict.fromkeys(new_words + review_words))}))


def review(goal_ranks_json: str, state_json: str, word: str, quality_str: str) -> None:
    goal_ranks = json.loads(goal_ranks_json)
    state = json.loads(state_json)
    quality = int(quality_str)
    filt = SRSFilter(goal_ranks)
    for w, info in state.items():
        st = filt.schedulers.setdefault(w, SpacedRepetitionScheduler()).state
        st.repetitions = int(info.get("repetitions", 0))
        st.interval = int(info.get("interval", 0))
        st.efactor = float(info.get("efactor", 2.5))
        st.next_review = datetime.fromisoformat(info["next_review"])
    filt.review(word, quality)
    new_state = {
        w: {
            "repetitions": s.state.repetitions,
            "interval": s.state.interval,
            "efactor": s.state.efactor,
            "next_review": s.state.next_review.isoformat(),
        }
        for w, s in filt.schedulers.items()
    }
    print(json.dumps({"state": new_state, "next_review": new_state[word]["next_review"]}))


def lesson(topic: str) -> None:
    print(json.dumps(generate_lesson(topic)))


def default_goals() -> None:
    print(json.dumps([g.__dict__ for g in load_default_goals()]))


def default_words() -> None:
    print(json.dumps([g.word for g in load_default_goals()]))


def media_suggest(word: str, level_str: str) -> None:
    level = int(level_str)
    print(json.dumps(suggest_media(word, level)))


def media_record(user_id: str, media_id: str, word: str) -> None:
    record_media_interaction(user_id, media_id, word)
    print(json.dumps({"status": "ok"}))


def blurb(known_json: str, lplus_json: str, length_str: str) -> None:
    known = json.loads(known_json)
    lplus = json.loads(lplus_json)
    length = int(length_str)
    print(json.dumps({"blurb": generate_blurb(known, lplus, length)}))


def analytics_next(goal_ranks_json: str, review_json: str, visible_json: str) -> None:
    goal_ranks = json.loads(goal_ranks_json)
    review = json.loads(review_json)
    visible = set(json.loads(visible_json))
    filt = SRSFilter(goal_ranks)
    for word, info in review.items():
        st = filt.schedulers.setdefault(word, SpacedRepetitionScheduler()).state
        st.repetitions = int(info.get("repetitions", 0))
        st.interval = int(info.get("interval", 0))
        st.efactor = float(info.get("efactor", 2.5))
        st.next_review = datetime.fromisoformat(info["next_review"])
    next_words: list[str] = []
    for _ in range(5):
        nxt = filt.pop_next_due()
        if not nxt:
            break
        if visible and nxt not in visible:
            del filt.schedulers[nxt]
            continue
        next_words.append(nxt)
        del filt.schedulers[nxt]
    print(json.dumps({"next": next_words}))


COMMANDS = {
    "vocabulary": vocabulary,
    "lesson_queue": lesson_queue,
    "review": review,
    "lesson": lesson,
    "default_goals": default_goals,
    "default_words": default_words,
    "media_suggest": media_suggest,
    "media_record": media_record,
    "blurb": blurb,
    "analytics_next": analytics_next,
}


def main(argv: list[str] | None = None) -> None:
    argv = list(sys.argv[1:] if argv is None else argv)
    if not argv:
        raise SystemExit("No command provided")
    cmd = argv.pop(0)
    if cmd not in COMMANDS:
        raise SystemExit(f"Unknown command: {cmd}")
    COMMANDS[cmd](*argv)


if __name__ == "__main__":
    main()
