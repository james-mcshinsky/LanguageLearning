import { createClient } from 'redis';

export function createRedisClient(url = process.env.REDIS_URL || 'redis://localhost:6379') {
  const client = createClient({ url });
  client.on('error', (err) => console.error('Redis error', err));
  client.connect().catch(console.error);
  return client;
}
