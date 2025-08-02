import express from 'express';
import { runPython } from '../../shared/utils';

export function createMediaService() {
  const app = express();
  app.use(express.json());
  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  app.get('/media', (req, res) => {
    const word = (req.query.word as string) || '';
    const level = Number(req.query.level || 1);
    const code = `
import json, sys
from language_learning.media_integration import suggest_media
word=sys.argv[1]
level=int(sys.argv[2])
print(json.dumps(suggest_media(word, level)))
`;
    try {
      const media = runPython(code, [word, String(level)]);
      res.json(media);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  return app;
}
