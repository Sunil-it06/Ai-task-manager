const getRedisConnection = require('../config/redis');

// We use a plain Redis LIST as the queue instead of a JS-specific library
// like BullMQ, because the consumer (worker) is written in Python.
// Backend: LPUSH a JSON payload onto "ai-tasks-queue"
// Worker:  BRPOP (blocking pop) from "ai-tasks-queue"
const QUEUE_KEY = 'ai-tasks-queue';

async function enqueueTask(taskId) {
  const redis = getRedisConnection();
  const payload = JSON.stringify({ taskId, enqueuedAt: new Date().toISOString() });
  await redis.lpush(QUEUE_KEY, payload);
}

module.exports = { enqueueTask, QUEUE_KEY };