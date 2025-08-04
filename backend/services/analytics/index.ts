import express from 'express';
import { runPython, buildGoalRanks } from '../../shared/utils';
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
    const { activeGoals, goalRanks } = buildGoalRanks(goals, defaults, review);
    try {
      const result = await runPython('language_learning.entrypoints', [
        'analytics_next',
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
