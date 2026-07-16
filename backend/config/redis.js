const IORedis = require('ioredis');

let connection;

function getRedisConnection() {
  if (!connection) {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    connection = new IORedis(redisUrl, {
      maxRetriesPerRequest: null, // required by BullMQ
    });

    connection.on('connect', () => console.log('Redis connected successfully'));
    connection.on('error', (err) => console.error('Redis connection error:', err.message));
  }
  return connection;
}

module.exports = getRedisConnection;