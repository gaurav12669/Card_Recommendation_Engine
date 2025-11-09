const express = require('express');
const RecommendationController = require('../controllers/RecommendationController');
const validate = require('../middleware/validate');
const calculateSchema = require('../validators/calculate.validator');

const router = express.Router();

router.post('/', validate(calculateSchema), RecommendationController.calculateRecommendations);

module.exports = router;

