import express from 'express';
import { runPython } from '../../shared/utils';
import { DATA_PATH } from '../../shared/database';

export function createAnalyticsService() {
  const app = express();
  app.use(express.json());
  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  // Overall progress: number of learned words vs total goals
  app.get('/progress', (_req, res) => {
    const code = `
import json, sys
from language_learning.storage import JSONStorage
store=JSONStorage(sys.argv[1])
goals=store.load_goals()
review=store.load_review_state()
print(json.dumps({"learned": len(review), "total": len(goals)}))
`;
    try {
      const result = runPython(code, [DATA_PATH]);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Next five review items based on spaced repetition state
  app.get('/reviews/next', (_req, res) => {
    const code = `
import json, sys
from datetime import datetime
from language_learning.storage import JSONStorage
from language_learning.spaced_repetition import SRSFilter, SpacedRepetitionScheduler
store=JSONStorage(sys.argv[1])
goals=store.load_goals()
review=store.load_review_state()
goal_ranks={g.word: i+1 for i,g in enumerate(goals)}
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
    next_words.append(nxt)
    del filt.schedulers[nxt]
print(json.dumps({"next": next_words}))
`;
    try {
      const result = runPython(code, [DATA_PATH]);
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
