const asyncRedis = require('async-redis');
const tls = require('tls');
const dotenv = require('dotenv');

dotenv.config();

class InMemoryCache {
  constructor() {
    this.store = new Map();
  }

  async get(key) {
    const entry = this.store.get(key);
    if (!entry) {
      return null;
    }
    if (entry.expireAt && entry.expireAt <= Date.now()) {
      this.store.delete(key);
      return null;
    }
    return entry.value;
  }

  async set(key, value) {
    const current = this.store.get(key) || {};
    this.store.set(key, {
      value,
      expireAt: current.expireAt || null,
    });
    return 'OK';
  }

  async expire(key, seconds) {
    const entry = this.store.get(key);
    if (!entry) {
      return 0;
    }
    entry.expireAt = Date.now() + seconds * 1000;
    this.store.set(key, entry);
    return 1;
  }

  async del(key) {
    return this.store.delete(key) ? 1 : 0;
  }
}

class RedisClient {
  constructor() {
    this.inMemoryCache = new InMemoryCache();
    this.client = this.inMemoryCache;
    this.connectionPromise = null;
    this.initialise();
  }

  static getInstance() {
    if (!RedisClient.instance) {
      RedisClient.instance = new RedisClient();
    }
    return RedisClient.instance;
  }

  async getClient() {
    return this.client;
  }

  initialise() {
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    if (process.env.REDIS_DISABLED === 'true') {
      console.log('Redis disabled via environment flag, using in-memory cache.');
      this.connectionPromise = Promise.resolve(this.inMemoryCache);
      return this.connectionPromise;
    }

    this.connectionPromise = this.createRedisClient()
      .then((client) => {
        this.client = client;
        return client;
      })
      .catch((error) => {
        console.error('Redis connection failed, using in-memory cache:', error.message);
        this.connectionPromise = null;
        this.client = this.inMemoryCache;
        return this.inMemoryCache;
      });

    return this.connectionPromise;
  }

  async createRedisClient() {
    const redisUrl = process.env.REDIS_URL;
    const username = process.env.REDIS_USERNAME || undefined;
    const password = process.env.REDIS_PASSWORD || undefined;
    const useTls =
      process.env.REDIS_TLS === 'true' ||
      (!!redisUrl && redisUrl.startsWith('rediss://')) ||
      (!!process.env.REDIS_HOST && process.env.REDIS_HOST.endsWith('redis-cloud.com'));
    const rejectUnauthorized = process.env.REDIS_TLS_REJECT_UNAUTHORIZED !== 'false';

    const options = {
      username,
      password,
      tls: useTls
        ? {
            rejectUnauthorized,
          }
        : undefined,
    };

    let client;

    if (redisUrl) {
      client = asyncRedis.createClient(redisUrl, options);
    } else {
      client = asyncRedis.createClient({
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: Number(process.env.REDIS_PORT || 6379),
        username,
        password,
        tls: options.tls,
      });
    }

    client.on('error', (err) => {
      console.error('Redis connection error:', err.message);
    });

    return new Promise((resolve, reject) => {
      const cleanup = () => {
        client.removeListener('ready', onReady);
        client.removeListener('error', onError);
      };

      const onReady = () => {
        console.log('Redis connected successfully');
        cleanup();
        resolve(client);
      };

      const onError = (err) => {
        cleanup();
        reject(err);
      };

      client.once('ready', onReady);
      client.once('error', onError);
    });
  }
}

module.exports = RedisClient.getInstance();

