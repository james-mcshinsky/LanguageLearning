import express from 'express';
import { runPython } from '../../shared/utils';

export function createMediaService() {
  const app = express();
  app.use(express.json());
  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  // ---------------------------------------------------------------------------
  // Media suggestions
  app.get('/suggest', (req, res) => {
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

  // Record a learner interaction with a media item
  app.post('/interaction', (req, res) => {
    const { userId, mediaId, word } = req.body || {};
    if (!userId || !mediaId || !word) {
      return res.status(400).json({ error: 'userId, mediaId and word required' });
    }
    const code = `
import json, sys
from language_learning.media_integration import record_media_interaction
record_media_interaction(sys.argv[1], sys.argv[2], sys.argv[3])
print(json.dumps({'status': 'ok'}))
`;
    try {
      const result = runPython(code, [userId, mediaId, word]);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // AI blurb generation
  app.post('/blurb', (req, res) => {
    const { knownWords = [], lPlusOneWords = [], length = 0 } = req.body || {};
    const code = `
import json, sys
from language_learning.ai_blurbs import generate_blurb
known=json.loads(sys.argv[1])
lplus=json.loads(sys.argv[2])
length=int(sys.argv[3])
print(json.dumps({'blurb': generate_blurb(known, lplus, length)}))
`;
    try {
      const result = runPython(code, [
        JSON.stringify(knownWords),
        JSON.stringify(lPlusOneWords),
        String(length),
      ]);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  return app;
}
