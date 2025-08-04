import express from 'express';
import { runPython, buildGoalRanks } from '../../shared/utils';
import {
  loadGoals,
  loadReviewState,
  saveReviewState,
  loadDefaultCocaWords,
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
    const defaults = await loadDefaultCocaWords();
    const review = await loadReviewState();
    const { activeGoals, goalRanks } = buildGoalRanks(goals, defaults, review);
    try {
      const result =
        (await runPython('language_learning.entrypoints', [
          'lesson_queue',
          JSON.stringify(goalRanks),
          JSON.stringify(activeGoals),
          JSON.stringify(review),
        ])) || { lesson: [], words: [] };
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
    const defaults = await loadDefaultCocaWords();
    const state = await loadReviewState();
    const { goalRanks } = buildGoalRanks(goals, defaults, state);
    try {
      const result = await runPython('language_learning.entrypoints', [
        'review',
        JSON.stringify(goalRanks),
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
  app.get('/lesson', async (req, res) => {
    const topic = (req.query.topic as string) || '';
    try {
      const lesson = await runPython('language_learning.entrypoints', [
        'lesson',
        topic,
      ]);
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

