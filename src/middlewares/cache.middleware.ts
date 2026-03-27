import { CacheService } from "@/services/cache.service";
import { NextFunction, Request, Response } from "express";

export interface CacheOptions {
  ttl?: number;
  keyPrefix: string;
}

const DEFAULT_TTL = 180;
const CACHE_PREFIX = "api:";
const STAMPEDE_LOCK_TTL = 20;

export function createCacheMiddleware(cacheService: CacheService) {
  function publicCache(options: CacheOptions) {
    return cacheHandler(cacheService, false, options);
  }
  function protectedCache(options: CacheOptions) {
    return cacheHandler(cacheService, true, options);
  }
  return {
    publicCache,
    protectedCache,
  };
}

function cacheHandler(
  cacheService: CacheService,
  isPrivate: boolean,
  options: CacheOptions,
) {
  const { ttl = DEFAULT_TTL, keyPrefix } = options;

  if (!keyPrefix || keyPrefix.trim() === "") {
    throw new Error("KeyPrefix is required");
  }
  return async (req: Request, res: Response, next: NextFunction) => {
    //  Only cache GET
    if (req.method !== "GET") {
      return next();
    }
    // Check auth for private data
    const userId = req.userId;
    if (isPrivate && !userId) {
      return next();
    }

    // build cache key
    const cacheKey = buildCacheKey(req, keyPrefix, isPrivate, userId);
    const lockKey = `${cacheKey}:lock`;

    // caching
    try {
      const cached = await cacheService.get(cacheKey);
      if (cached !== null) {
        res.setHeader("X-Cache", "HIT");
        res.setHeader("Content-Type", "application/json");
        return res.send(cached);
      }
      // Stampede protection (lock)
      const isLocked = await cacheService.get(lockKey);
      if (isLocked) {
        return next();
      }
      await cacheService.set(lockKey, true, STAMPEDE_LOCK_TTL);

      // binding
      const orginalSend = res.send;
      res.send = function (body: any): Response {
        if (res.statusCode === 200 && body) {
          const jitter = Math.floor(Math.random() * 30);
          const finallTtl = ttl + jitter;
          cacheService
            .set(cacheKey, body, finallTtl)
            .catch((err) => console.error("Redis set error " + err));
        }
        // Clean up locks (Prevent Deadlocks)
        cacheService.invalidate(lockKey).catch(() => {});
        return orginalSend.call(this, body);
      };
      // to controller
      next();
    } catch (err) {
      console.error(err);
      next();
    }
  };
}

function buildCacheKey(
  req: Request,
  prefix: string,
  isPrivate: boolean,
  userId?: string,
) {
  let key = `${CACHE_PREFIX}${prefix}`;
  if (isPrivate && userId) {
    key += `:u:${userId}:`;
  } else {
    key += ":public:";
  }

  return key + req.originalUrl;
}

export type CacheMiddleware = ReturnType<typeof createCacheMiddleware>;
