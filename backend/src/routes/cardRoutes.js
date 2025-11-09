const express = require('express');
const CardController = require('../controllers/CardController');

const router = express.Router();

router.get('/:id', CardController.getCardDetails);

module.exports = router;

