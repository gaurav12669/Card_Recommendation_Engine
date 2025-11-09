const CategoryService = require('../services/CategoryService');
const redisClient = require('../lib/RedisClient');
const asyncHandler = require('../utils/asyncHandler');

const CATEGORY_CACHE_KEY = 'categories:all';
const CACHE_TTL_SECONDS = 3600;

const getCategories = asyncHandler(async (req, res) => {
  let cached;
  try {
    const client = await redisClient.getClient();
    cached = await client.get(CATEGORY_CACHE_KEY);
    if (cached) {
      return res.json(JSON.parse(cached));
    }
  } catch (cacheError) {
    console.warn('Redis cache fetch failed for categories:', cacheError.message);
  }

  const categories = await CategoryService.getActiveCategories();

  try {
    const client = await redisClient.getClient();
    await client.set(CATEGORY_CACHE_KEY, JSON.stringify(categories));
    await client.expire(CATEGORY_CACHE_KEY, CACHE_TTL_SECONDS);
  } catch (cacheError) {
    console.warn('Redis cache set failed for categories:', cacheError.message);
  }

  return res.json(categories);
});

module.exports = {
  getCategories,
};

