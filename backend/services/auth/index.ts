import express from 'express';

export function createAuthService() {
  const app = express();
  app.use(express.json());
  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  type User = { id: number; username: string; password: string };
  const users: User[] = [];
  let nextId = 1;

  app.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'username and password required' });
    }
    const user: User = { id: nextId++, username, password };
    users.push(user);
    res.status(201).json({ id: user.id, username: user.username });
  });

  app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find((u) => u.username === username && u.password === password);
    if (!user) {
      return res.status(401).json({ error: 'invalid credentials' });
    }
    // Return a mock token
    res.json({ token: `mock-token-${user.id}` });
  });

  app.get('/users', (_req, res) => {
    res.json({ users: users.map(({ password, ...rest }) => rest) });
  });

  app.delete('/users/:id', (req, res) => {
    const id = Number(req.params.id);
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: 'user not found' });
    }
    users.splice(idx, 1);
    res.status(204).send();
  });

  return app;
}
