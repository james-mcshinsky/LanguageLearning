import express from 'express';
import { runPython } from '../../shared/utils';

export function createLessonService() {
  const app = express();
  app.use(express.json());
  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

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
