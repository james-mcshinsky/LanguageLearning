import express from 'express';

export function createMediaService() {
  const app = express();
  app.use(express.json());
  app.get('/health', (_req, res) => res.json({ status: 'ok' }));
  return app;
}
