const CardService = require('../services/CardService');
const asyncHandler = require('../utils/asyncHandler');

const calculateRecommendations = asyncHandler(async (req, res) => {
  const spends = {
    travel: req.body.travel || 0,
    shopping: req.body.shopping || 0,
    fuel: req.body.fuel || 0,
    food: req.body.food || 0,
  };

  const results = await CardService.getCardRecommendations(spends);
  return res.json(results);
});

module.exports = {
  calculateRecommendations,
};

