import express from 'express';
import { runPython } from '../../shared/utils';

export function createMediaService() {
  const app = express();
  app.use(express.json());
  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  // ---------------------------------------------------------------------------
  // Media suggestions
  app.get('/suggest', async (req, res) => {
    const word = (req.query.word as string) || '';
    const level = Number(req.query.level || 1);
    try {
      const media = await runPython('language_learning.entrypoints', [
        'media_suggest',
        word,
        String(level),
      ]);
      res.json(media);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Record a learner interaction with a media item
  app.post('/interaction', async (req, res) => {
    const { userId, mediaId, word } = req.body || {};
    if (!userId || !mediaId || !word) {
      return res.status(400).json({ error: 'userId, mediaId and word required' });
    }
    try {
      const result = await runPython('language_learning.entrypoints', [
        'media_record',
        userId,
        mediaId,
        word,
      ]);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // AI blurb generation
  app.post('/blurb', async (req, res) => {
    const { knownWords = [], lPlusOneWords = [], length = 0 } = req.body || {};
    try {
      const result = await runPython('language_learning.entrypoints', [
        'blurb',
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
