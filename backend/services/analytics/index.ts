import express from 'express';
import { runPython } from '../../shared/utils';
import {
  loadGoals,
  loadReviewState,
  loadDefaultCocaWords,
} from '../../shared/database';

export function createAnalyticsService() {
  const app = express();
  app.use(express.json());
  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  // Overall progress: number of learned words vs total goals
  app.get('/progress', async (_req, res) => {
    try {
      const goals = await loadGoals();
      const review = await loadReviewState();
      res.json({ learned: Object.keys(review).length, total: goals.length });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Per-goal progress details used by goal views
  app.get('/goals', async (_req, res) => {
    try {
      const goals = await loadGoals();
      const review = await loadReviewState();
      const items = goals.map((g) => ({
        ...g,
        nextReview: review[g.word]?.next_review || null,
        reviewed: !!review[g.word],
      }));
      res.json({ goals: items });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Next five review items based on spaced repetition state
  app.get('/reviews/next', async (_req, res) => {
    const goals = await loadGoals();
    const defaults = await loadDefaultCocaWords();
    const review = await loadReviewState();
    const customGoals = goals.filter((g) => !g.is_default);
    const activeGoals =
      customGoals.length > 0
        ? customGoals
        : defaults.map((w) => ({ word: w }));
    const goalRanks: Record<string, number> = {};
    defaults.forEach((w, i) => {
      goalRanks[w] = i + 1;
    });
    activeGoals.forEach((g, i) => {
      goalRanks[g.word] = i + 1;
    });
    const code = `
import json, sys
from datetime import datetime
from language_learning.spaced_repetition import SRSFilter, SpacedRepetitionScheduler
goal_ranks=json.loads(sys.argv[1])
review=json.loads(sys.argv[2])
visible=json.loads(sys.argv[3])
visible=set(visible)
filt=SRSFilter(goal_ranks)
for word, info in review.items():
    st=filt.schedulers.setdefault(word, SpacedRepetitionScheduler()).state
    st.repetitions=int(info.get('repetitions',0))
    st.interval=int(info.get('interval',0))
    st.efactor=float(info.get('efactor',2.5))
    st.next_review=datetime.fromisoformat(info['next_review'])
next_words=[]
for _ in range(5):
    nxt=filt.pop_next_due()
    if not nxt:
        break
    if visible and nxt not in visible:
        del filt.schedulers[nxt]
        continue
    next_words.append(nxt)
    del filt.schedulers[nxt]
print(json.dumps({'next': next_words}))
`;
    try {
      const result = await runPython(code, [
        JSON.stringify(goalRanks),
        JSON.stringify(review),
        JSON.stringify(activeGoals.map((g) => g.word)),
      ]);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Legacy reports endpoint
  app.get('/reports', (_req, res) => {
    res.json({ activeUsers: 0, lessonsCompleted: 0 });
  });

  return app;
}
