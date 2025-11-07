const express = require('express');
const router = express.Router();
const pool = require('../config/database');

/**
 * GET /categories
 * Returns all active spending categories
 */
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, `key`, name FROM categories WHERE is_active = 1 ORDER BY id'
    );

    // If no data in DB, return mock data
    if (rows.length === 0) {
      return res.json([
        { id: 1, key: 'travel', name: 'Travel' },
        { id: 2, key: 'shopping', name: 'Shopping' },
        { id: 3, key: 'fuel', name: 'Fuel' },
        { id: 4, key: 'food', name: 'Food' }
      ]);
    }

    res.json(rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories', message: error.message });
  }
});

module.exports = router;

