import express from 'express';
import bcrypt from 'bcrypt';
import {
  createUser,
  getUserByUsername,
  listUsers,
  getUserById,
  saveUser,
  deleteUser,
} from '../../shared/database';

export function createAuthService() {
  const app = express();
  app.use(express.json());
  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'username and password required' });
    }
    const existing = await getUserByUsername(username);
    if (existing) {
      return res.status(400).json({ error: 'username already exists' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await createUser(username, passwordHash);
    res.status(201).json({ id: user.id, username: user.username });
  });

  app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await getUserByUsername(username);
    if (!user) {
      return res.status(401).json({ error: 'invalid credentials' });
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'invalid credentials' });
    }
    // Return a mock token
    res.json({ token: `mock-token-${user.id}` });
  });

  app.get('/users', async (_req, res) => {
    const users = await listUsers();
    res.json({ users });
  });

  app.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { username, password } = req.body as {
      username?: string;
      password?: string;
    };
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ error: 'user not found' });
    }
    if (username) user.username = username;
    if (password) user.passwordHash = await bcrypt.hash(password, 10);
    await saveUser(user);
    res.json({ id: user.id, username: user.username });
  });

  app.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ error: 'user not found' });
    }
    await deleteUser(id);
    res.status(204).send();
  });

  return app;
}
