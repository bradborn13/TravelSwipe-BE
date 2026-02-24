import Redis from 'ioredis';

const redis = new Redis({
  host: '127.0.0.1',
  port: 6371,
});

redis.on('error', (err) => console.error('Redis Client Error', err));

export default redis;
