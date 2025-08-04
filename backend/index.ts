import 'dotenv/config';
import { createAuthService } from './services/auth';
import { createGoalService } from './services/goal';
import { createLessonService } from './services/lesson';
import { createMediaService } from './services/media';
import { createAnalyticsService } from './services/analytics';

const ports = {
  auth: Number(process.env.AUTH_PORT) || 3001,
  goal: Number(process.env.GOAL_PORT) || 3002,
  lesson: Number(process.env.LESSON_PORT) || 3003,
  media: Number(process.env.MEDIA_PORT) || 3004,
  analytics: Number(process.env.ANALYTICS_PORT) || 3005,
};

createAuthService().listen(ports.auth, () =>
  console.log(`Auth service listening on port ${ports.auth}`)
);
createGoalService().listen(ports.goal, () =>
  console.log(`Goal service listening on port ${ports.goal}`)
);
createLessonService().listen(ports.lesson, () =>
  console.log(`Lesson service listening on port ${ports.lesson}`)
);
createMediaService().listen(ports.media, () =>
  console.log(`Media service listening on port ${ports.media}`)
);
createAnalyticsService().listen(ports.analytics, () =>
  console.log(`Analytics service listening on port ${ports.analytics}`)
);
