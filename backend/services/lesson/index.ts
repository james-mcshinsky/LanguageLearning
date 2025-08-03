import express from 'express';
import { runPython } from '../../shared/utils';
import {
  loadGoals,
  loadReviewState,
  saveReviewState,
} from '../../shared/database';

export function createLessonService() {
  const app = express();
  const PY_SERVICE_URL = process.env.PY_SERVICE_URL || 'http://localhost:8000';
  const USE_LLM_BLURB =
    String(process.env.USE_LLM_BLURB || '').toLowerCase() === 'true';
  app.use(express.json());
  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  // ---------------------------------------------------------------------------
  // Generate a lesson queue based on goals and spaced repetition state
  app.get('/queue', async (_req, res) => {
    const goals = await loadGoals();
    const review = await loadReviewState();
    const code = `
import json, sys
from datetime import datetime
from language_learning.spaced_repetition import SRSFilter, SpacedRepetitionScheduler
from language_learning.ai_lessons import generate_mcq_lesson
goals=json.loads(sys.argv[1])
review=json.loads(sys.argv[2])
goal_ranks={g['word']: i+1 for i,g in enumerate(goals)}
filt=SRSFilter(goal_ranks)
for word, info in review.items():
    st=filt.schedulers.setdefault(word, SpacedRepetitionScheduler()).state
    st.repetitions=int(info.get('repetitions',0))
    st.interval=int(info.get('interval',0))
    st.efactor=float(info.get('efactor',2.5))
    st.next_review=datetime.fromisoformat(info['next_review'])
review_words=[]
while True:
    nxt=filt.pop_next_due()
    if not nxt:
        break
    review_words.append(nxt)
new_words=[g['word'] for g in goals if g['word'] not in review or review[g['word']].get('repetitions',0)==0]
new_words=[w for w in new_words if w not in review_words][:3]
lesson=generate_mcq_lesson('practice', new_words, review_words)
print(json.dumps({'lesson': lesson, 'words': list(dict.fromkeys(new_words+review_words))}))
`;
    try {
      const result =
        runPython(code, [JSON.stringify(goals), JSON.stringify(review)]) ||
        { lesson: [], words: [] };
      const queue = [...(result.lesson || [])];
      const words: string[] = result.words || [];
      words.forEach((word) => {
        queue.push({
          type: 'fill_blank',
          word,
          sentence: `Type the word '${word}'`,
          answer: word,
        });
        queue.push({
          type: 'matching',
          word,
          options: [word, `${word}_alt`],
          answer: word,
        });
      });
      res.json({ queue });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Record a learner review outcome and update spaced repetition state
  app.post('/review', async (req, res) => {
    const { word, quality } = req.body as { word: string; quality: number };
    const goals = await loadGoals();
    const state = await loadReviewState();
    const code = `
import json, sys
from datetime import datetime
from language_learning.spaced_repetition import SRSFilter, SpacedRepetitionScheduler
goals=json.loads(sys.argv[1])
state=json.loads(sys.argv[2])
word=sys.argv[3]
quality=int(sys.argv[4])
goal_ranks={g['word']: i+1 for i,g in enumerate(goals)}
filt=SRSFilter(goal_ranks)
for w, info in state.items():
    st=filt.schedulers.setdefault(w, SpacedRepetitionScheduler()).state
    st.repetitions=int(info.get('repetitions',0))
    st.interval=int(info.get('interval',0))
    st.efactor=float(info.get('efactor',2.5))
    st.next_review=datetime.fromisoformat(info['next_review'])
filt.review(word, quality)
new_state={w:{'repetitions':s.state.repetitions,'interval':s.state.interval,'efactor':s.state.efactor,'next_review':s.state.next_review.isoformat()} for w,s in filt.schedulers.items()}
print(json.dumps({'state': new_state, 'next_review': new_state[word]['next_review']}))
`;
    try {
      const result = runPython(code, [
        JSON.stringify(goals),
        JSON.stringify(state),
        word,
        String(quality),
      ]);
      await saveReviewState(result.state);
      res.json({ next_review: result.next_review });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // AI-generated lesson content
  app.get('/lesson', (req, res) => {
    const topic = (req.query.topic as string) || '';
    const code = `
import json, sys
from language_learning.ai_lessons import generate_lesson
topic=sys.argv[1]
print(json.dumps(generate_lesson(topic)))
`;
    try {
      const lesson = runPython(code, [topic]);
      res.json(lesson);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Bridge to Python service for vocabulary extraction
  app.post('/vocabulary', async (req, res) => {
    const { corpus } = req.body as { corpus: string };
    try {
      const response = await fetch(`${PY_SERVICE_URL}/vocabulary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ corpus }),
      });
      const data = await response.json();
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Bridge to Python service for lesson prompts
  app.post('/prompts', async (req, res) => {
    const { topic, new_words = [], review_words = [] } = req.body as {
      topic: string;
      new_words: string[];
      review_words: string[];
    };
    try {
      const response = await fetch(`${PY_SERVICE_URL}/lesson/prompts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, new_words, review_words }),
      });
      const data = await response.json();
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Bridge to Python service for blurb generation
  app.post('/blurb', async (req, res) => {
    const {
      known_words = [],
      l_plus_one_words = [],
      length = 0,
    } = req.body as {
      known_words: string[];
      l_plus_one_words: string[];
      length: number;
    };
    const path = USE_LLM_BLURB ? '/blurb/llm' : '/blurb';
    try {
      const response = await fetch(`${PY_SERVICE_URL}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ known_words, l_plus_one_words, length }),
      });
      const data = await response.json();
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Explicit LLM blurb endpoint
  app.post('/blurb/llm', async (req, res) => {
    const {
      known_words = [],
      l_plus_one_words = [],
      length = 0,
    } = req.body as {
      known_words: string[];
      l_plus_one_words: string[];
      length: number;
    };
    try {
      const response = await fetch(`${PY_SERVICE_URL}/blurb/llm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ known_words, l_plus_one_words, length }),
      });
      const data = await response.json();
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  return app;
}

