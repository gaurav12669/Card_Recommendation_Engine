const express = require('express');
const AnalyticsController = require('../controllers/AnalyticsController');
const validate = require('../middleware/validate');
const analyticsSchema = require('../validators/analytics.validator');

const router = express.Router();

router.post('/apply', validate(analyticsSchema), AnalyticsController.logApplication);

module.exports = router;

