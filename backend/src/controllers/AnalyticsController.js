const AnalyticsService = require('../services/AnalyticsService');
const asyncHandler = require('../utils/asyncHandler');

const logApplication = asyncHandler(async (req, res) => {
  const { cardId, cardName, bankName, userSpends, savings, metadata } = req.body;

  await AnalyticsService.logCardApplication({
    cardId,
    cardName,
    bankName,
    userSpends,
    savings,
    metadata,
  });

  return res.status(201).json({ success: true });
});

module.exports = {
  logApplication,
};

