const CardService = require('../services/CardService');
const redisClient = require('../lib/RedisClient');
const ApiError = require('../errors/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const CARD_CACHE_PREFIX = 'card:details:';
const CACHE_TTL_SECONDS = 3600;

const getCardDetails = asyncHandler(async (req, res, next) => {
  const cardId = parseInt(req.params.id, 10);
  if (Number.isNaN(cardId)) {
    return next(ApiError.badRequest('Invalid card ID'));
  }

  const cacheKey = `${CARD_CACHE_PREFIX}${cardId}`;

  try {
    const client = await redisClient.getClient();
    const cached = await client.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }
  } catch (cacheError) {
    console.warn(`Redis cache fetch failed for card ${cardId}:`, cacheError.message);
  }

  const card = await CardService.getCardById(cardId);
  if (!card) {
    return next(ApiError.notFound('Card not found'));
  }

  try {
    const client = await redisClient.getClient();
    await client.set(cacheKey, JSON.stringify(card));
    await client.expire(cacheKey, CACHE_TTL_SECONDS);
  } catch (cacheError) {
    console.warn(`Redis cache set failed for card ${cardId}:`, cacheError.message);
  }

  return res.json(card);
});

module.exports = {
  getCardDetails,
};

