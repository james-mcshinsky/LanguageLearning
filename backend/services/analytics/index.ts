import express from 'express';

export function createAnalyticsService() {
  const app = express();
  app.use(express.json());
  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  app.get('/reports', (_req, res) => {
    res.json({ activeUsers: 0, lessonsCompleted: 0 });
  });

  return app;
}
