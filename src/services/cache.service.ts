import { Logger } from "@/logger/types";
import IORedis from "ioredis";

const CACHE_PREFIX = "api:";
const DEFAULT_TTL = 300;
export function createCacheService(redis: IORedis, logger: Logger) {
  async function get<T>(keyPart: string): Promise<T | null> {
    const key = `${CACHE_PREFIX}${keyPart}`;
    try {
      const data = await redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      logger.warn("Cache get failed", { key, err });
      return null;
    }
  }
  async function set<T>(keyPart: string, data: T, ttl = DEFAULT_TTL) {
    const key = `${CACHE_PREFIX}${keyPart}`;
    try {
      await redis.set(key, JSON.stringify(data), "EX", ttl);
    } catch (err) {
      logger.warn("Cache set failed", { key, err });
    }
  }
  async function invalidate(pattern: string) {
    const keyPattern = `${CACHE_PREFIX}${pattern}`;
    try {
      const keys = await redis.keys(keyPattern);
      if (keys.length) await redis.del(keys);
    } catch (err) {
      logger.warn("Cache invalidate failed", { pattern, err });
    }
  }

  return {
    get,
    set,
    invalidate,
  };
}

export type CacheService = ReturnType<typeof createCacheService>;
