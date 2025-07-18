import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const cacheManager = {
  /**
   * Получить данные по ключу из кэша
   */
  async get<T>(key: string): Promise<T | null> {
    return await redis.get<T>(key);
  },
async getOrSet<T>(key: string, fetchFn: () => Promise<T>): Promise<T> {
  const cached = await this.get<T>(key);
  if (cached !== null && cached !== undefined) return cached;

  const fresh = await fetchFn();
  await this.set(key, fresh);
  return fresh;
},

  /**
   * Установить значение в кэш
   */
  async set<T>(key: string, value: T, ttlSeconds = 86400): Promise<void> {
    await redis.set(key, value, { ex: ttlSeconds }); // по умолчанию 24ч
  },

  /**
   * Удалить кэш по ключу
   */
  async del(key: string): Promise<void> {
    await redis.del(key);
  },
};

export default cacheManager;
