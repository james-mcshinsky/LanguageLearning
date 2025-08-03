import express from 'express';
import path from 'path';
import { runPython } from '../../shared/utils';

export function createLessonService() {
  const app = express();
  app.use(express.json());
  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  const statePath = path.join(__dirname, 'srs_state.json');

  app.get('/queue', (_req, res) => {
    const code = `
import json, sys
from language_learning.spaced_repetition import SRSFilter
from language_learning.ai_lessons import generate_mcq_lesson

state_path = sys.argv[1]
vocab = {"hola":1, "adios":2, "gracias":3, "por favor":4}
filt = SRSFilter.load_state(state_path)
if not filt.schedulers:
    filt = SRSFilter(vocab)
    filt.save_state(state_path)

review_words = []
while True:
    nxt = filt.pop_next_due()
    if not nxt:
        break
    review_words.append(nxt)

new_words = [w for w in vocab if w not in filt.schedulers or filt.schedulers[w].state.repetitions == 0]
new_words = [w for w in new_words if w not in review_words][:3]
lesson = generate_mcq_lesson("practice", new_words, review_words)
print(json.dumps({"lesson": lesson, "words": list(dict.fromkeys(new_words + review_words))}))
`;
    try {
      const result = runPython(code, [statePath]) || { lesson: [], words: [] };
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

  app.post('/review', (req, res) => {
    const { word, quality } = req.body as { word: string; quality: number };
    const code = `
import json, sys
from language_learning.spaced_repetition import SRSFilter

state_path, word, quality = sys.argv[1], sys.argv[2], int(sys.argv[3])
filt = SRSFilter.load_state(state_path)
filt.review(word, quality)
filt.save_state(state_path)
print(json.dumps({"next_review": filt.schedulers[word].state.next_review.isoformat()}))
`;
    try {
      const result = runPython(code, [statePath, word, String(quality)]);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

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

  return app;
}
