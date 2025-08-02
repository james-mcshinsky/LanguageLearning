import express from 'express';
import path from 'path';
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

  return app;
}
