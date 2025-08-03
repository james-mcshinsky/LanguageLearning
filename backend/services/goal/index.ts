import express from 'express';
import fs from 'fs';
import path from 'path';
import { runPython } from '../../shared/utils';
import { loadGoals, saveGoals } from '../../shared/database';

export function createGoalService() {
  const app = express();
  app.use(express.json());
  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  // ---------------------------------------------------------------------------
  // Basic CRUD for goals stored in the shared JSON data file
  app.get('/goals', async (_req, res) => {
    try {
      res.json({ goals: await loadGoals() });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/goals/:word', async (req, res) => {
    try {
      const goals = await loadGoals();
      const goal = goals.find((g) => g.word === req.params.word);
      if (!goal) {
        return res.status(404).json({ error: 'goal not found' });
      }
      res.json(goal);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/goals', async (req, res) => {
    const { word, weight } = req.body as { word?: string; weight?: number };
    if (!word) {
      return res.status(400).json({ error: 'word required' });
    }
    try {
      const goals = await loadGoals();
      goals.push({ word, weight });
      await saveGoals(goals);
      res.status(201).json({ goals });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/goals/:word', async (req, res) => {
    const { weight } = req.body as { weight?: number };
    try {
      const goals = await loadGoals();
      const goal = goals.find((g) => g.word === req.params.word);
      if (!goal) {
        return res.status(404).json({ error: 'goal not found' });
      }
      goal.weight = weight;
      await saveGoals(goals);
      res.json({ goals });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/goals/:word', async (req, res) => {
    try {
      const goals = (await loadGoals()).filter(
        (g) => g.word !== req.params.word,
      );
      await saveGoals(goals);
      res.status(204).send();
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Bulk creation of goals
  app.post('/goals/bulk', async (req, res) => {
    const { items } = req.body as { items: { word: string; weight?: number }[] };
    if (!Array.isArray(items)) {
      return res.status(400).json({ error: 'items array required' });
    }
    try {
      const goals = await loadGoals();
      items.forEach((g) => goals.push({ word: g.word, weight: g.weight }));
      await saveGoals(goals);
      res.status(201).json({ goals });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Extract vocabulary from provided text using Python helper
  app.post('/goals/extract', async (req, res) => {
    const { text } = req.body as { text?: string };
    if (!text) {
      return res.status(400).json({ error: 'text required' });
    }
    const goals = await loadGoals();
    const tempPath = path.resolve(__dirname, '../../../tmp_corpus.txt');
    fs.writeFileSync(tempPath, text, 'utf-8');
    const code = `
import json, sys
from language_learning.goals import GoalManager, GoalItem
from language_learning.vocabulary import extract_vocabulary
goals=json.loads(sys.argv[1])
path=sys.argv[2]
manager=GoalManager()
for g in goals:
    manager.create_goal(GoalItem(g['word'], float(g.get('weight',1))))
vocab=extract_vocabulary(path, manager)
print(json.dumps({'vocab': vocab}))
`;
    try {
      const result = runPython(code, [JSON.stringify(goals), tempPath]);
      fs.unlinkSync(tempPath);
      res.json(result);
    } catch (err: any) {
      try {
        fs.unlinkSync(tempPath);
      } catch {
        /* ignore */
      }
      res.status(500).json({ error: err.message });
    }
  });

  return app;
}

