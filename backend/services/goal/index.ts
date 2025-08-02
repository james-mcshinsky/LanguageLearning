import express from 'express';
import path from 'path';
import fs from 'fs';
import { runPython } from '../../shared/utils';

export function createGoalService() {
  const app = express();
  app.use(express.json());
  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  const dataPath = path.resolve(__dirname, '../../../data.json');

  app.get('/goals', (_req, res) => {
    const code = `
import json, sys
from language_learning.storage import JSONStorage
from language_learning.goals import GoalManager
from dataclasses import asdict
store=JSONStorage(sys.argv[1])
manager=GoalManager()
for item in store.load_goals():
    manager.create_goal(item)
print(json.dumps({"goals": [asdict(g) for g in manager.list_goals()]}))
`;
    try {
      const result = runPython(code, [dataPath]);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/goals', (req, res) => {
    const { word, weight } = req.body;
    if (!word) {
      return res.status(400).json({ error: 'word required' });
    }
    const code = `
import json, sys
from language_learning.storage import JSONStorage
from language_learning.goals import GoalManager, GoalItem
from dataclasses import asdict
store=JSONStorage(sys.argv[1])
manager=GoalManager()
for item in store.load_goals():
    manager.create_goal(item)
manager.create_goal(GoalItem(sys.argv[2], float(sys.argv[3])))
store.save_goals(manager.list_goals())
print(json.dumps({"goals": [asdict(g) for g in manager.list_goals()]}))
`;
    try {
      const result = runPython(code, [dataPath, word, String(weight ?? 1)]);
      res.status(201).json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/goals/:word', (req, res) => {
    const { word } = req.params;
    const { weight } = req.body;
    const code = `
import json, sys
from language_learning.storage import JSONStorage
from language_learning.goals import GoalManager
from dataclasses import asdict
store=JSONStorage(sys.argv[1])
manager=GoalManager()
for item in store.load_goals():
    manager.create_goal(item)
manager.update_goal(sys.argv[2], float(sys.argv[3]))
store.save_goals(manager.list_goals())
print(json.dumps({"goals": [asdict(g) for g in manager.list_goals()]}))
`;
    try {
      const result = runPython(code, [dataPath, word, String(weight ?? 1)]);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/goals/:word', (req, res) => {
    const { word } = req.params;
    const code = `
import json, sys
from language_learning.storage import JSONStorage
from language_learning.goals import GoalManager
from dataclasses import asdict
store=JSONStorage(sys.argv[1])
manager=GoalManager()
for item in store.load_goals():
    manager.create_goal(item)
manager.delete_goal(sys.argv[2])
store.save_goals(manager.list_goals())
print(json.dumps({"goals": [asdict(g) for g in manager.list_goals()]}))
`;
    try {
      const result = runPython(code, [dataPath, word]);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Bulk creation of goals
  app.post('/goals/bulk', (req, res) => {
    const { items } = req.body as { items: { word: string; weight?: number }[] };
    if (!Array.isArray(items)) {
      return res.status(400).json({ error: 'items array required' });
    }
    const code = `
import json, sys
from language_learning.storage import JSONStorage
from language_learning.goals import GoalManager, GoalItem
from dataclasses import asdict
store=JSONStorage(sys.argv[1])
manager=GoalManager()
for item in store.load_goals():
    manager.create_goal(item)
payload=json.loads(sys.argv[2])
for entry in payload:
    manager.create_goal(GoalItem(entry['word'], float(entry.get('weight',1))))
store.save_goals(manager.list_goals())
print(json.dumps({"goals": [asdict(g) for g in manager.list_goals()]}))
`;
    try {
      const result = runPython(code, [dataPath, JSON.stringify(items)]);
      res.status(201).json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Extract vocabulary from provided text
  app.post('/goals/extract', (req, res) => {
    const { text } = req.body as { text?: string };
    if (!text) {
      return res.status(400).json({ error: 'text required' });
    }
    const tempPath = path.resolve(__dirname, '../../../tmp_corpus.txt');
    fs.writeFileSync(tempPath, text, 'utf-8');
    const code = `
import json, sys
from language_learning.storage import JSONStorage
from language_learning.goals import GoalManager
from language_learning.vocabulary import extract_vocabulary
store=JSONStorage(sys.argv[1])
manager=GoalManager()
for item in store.load_goals():
    manager.create_goal(item)
vocab=extract_vocabulary(sys.argv[2], manager)
print(json.dumps({"vocab": vocab}))
`;
    try {
      const result = runPython(code, [dataPath, tempPath]);
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
