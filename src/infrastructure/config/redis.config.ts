import Redis from "ioredis";

/**
 * Redis Client Configuration
 */

let redisClient: Redis | null = null;

export interface RedisConfig {
  host: string;
  port: number;
}

function getRedisConfig(): RedisConfig {
  return {
    host: process.env["REDIS_HOST"] || "localhost",
    port: parseInt(process.env["REDIS_PORT"] || "6379", 10),
  };
}

/**
 * Get or create Redis client instance
 */
export function getRedisClient(): Redis {
  if (!redisClient) {
    const config = getRedisConfig();
    redisClient = new Redis({
      host: config.host,
      port: config.port,
      retryStrategy: (times: number) => {
        // Retry with exponential backoff, max 30 seconds
        const delay = Math.min(times * 100, 30000);
        return delay;
      },
    });

    redisClient.on("connect", () => {
      console.log("Redis connection established");
    });

    redisClient.on("error", (err: Error) => {
      console.error("Redis connection error:", err);
    });
  }
  return redisClient;
}

/**
 * Close Redis connection
 */
export async function closeRedis(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
    console.log("Redis connection closed");
  }
}

/**
 * Basic cache operations
 */
export const cache = {
  async get<T>(key: string): Promise<T | null> {
    const client = getRedisClient();
    const value = await client.get(key);
    if (!value) return null;
    return JSON.parse(value) as T;
  },

  async set(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
    const client = getRedisClient();
    const serialized = JSON.stringify(value);
    if (ttlSeconds) {
      await client.setex(key, ttlSeconds, serialized);
    } else {
      await client.set(key, serialized);
    }
  },

  async delete(key: string): Promise<void> {
    const client = getRedisClient();
    await client.del(key);
  },

  async exists(key: string): Promise<boolean> {
    const client = getRedisClient();
    const result = await client.exists(key);
    return result === 1;
  },
};
