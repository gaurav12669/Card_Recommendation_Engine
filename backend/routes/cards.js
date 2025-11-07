const express = require('express');
const router = express.Router();
const pool = require('../config/database');

/**
 * GET /cards/:id
 * Returns detailed information for a single card
 */
router.get('/:id', async (req, res) => {
  try {
    const cardId = parseInt(req.params.id);

    if (isNaN(cardId)) {
      return res.status(400).json({ error: 'Invalid card ID' });
    }

    // Get card basic info
    const [cards] = await pool.execute(`
      SELECT 
        c.id,
        c.card_name,
        c.annual_fees,
        c.joining_fees,
        c.reward_points,
        c.rating,
        c.reviews_count,
        b.bank_name
      FROM cards c
      INNER JOIN banks b ON c.bank_id = b.id
      WHERE c.id = ? AND c.is_active = 1
    `, [cardId]);

    if (cards.length === 0) {
      return res.status(404).json({ error: 'Card not found' });
    }

    const card = cards[0];

    // Get card features
    const [features] = await pool.execute(`
      SELECT feature_title, feature_description
      FROM card_features
      WHERE card_id = ?
      ORDER BY id
    `, [cardId]);

    // Get eligibility criteria
    const [eligibility] = await pool.execute(`
      SELECT 
        min_age,
        max_age,
        min_income,
        min_cibil_score
      FROM eligibility_criteria
      WHERE card_id = ?
      LIMIT 1
    `, [cardId]);

    // Get category savings
    const [categorySavings] = await pool.execute(`
      SELECT 
        cat.name as category_name,
        cs.savings_percentage
      FROM category_savings cs
      INNER JOIN categories cat ON cs.category_key = cat.key
      WHERE cs.card_id = ?
      ORDER BY cat.name
    `, [cardId]);

    // If no data in DB, return mock data
    if (features.length === 0 && eligibility.length === 0) {
      return res.json({
        ...card,
        features: [
          {
            feature_title: '4X reward points on dining',
            feature_description: 'Earn accelerated rewards on restaurant spends'
          },
          {
            feature_title: '2X on online shopping',
            feature_description: 'Double rewards on e-commerce purchases'
          },
          {
            feature_title: 'Complimentary airport lounge',
            feature_description: '4 domestic + 2 international per year'
          }
        ],
        eligibility: {
          min_age: 21,
          max_age: 60,
          min_income: 500000,
          min_cibil_score: 750
        },
        category_savings: categorySavings
      });
    }

    res.json({
      ...card,
      features: features,
      eligibility: eligibility[0] || null,
      category_savings: categorySavings
    });
  } catch (error) {
    console.error('Error fetching card details:', error);
    res.status(500).json({ error: 'Failed to fetch card details', message: error.message });
  }
});

module.exports = router;

