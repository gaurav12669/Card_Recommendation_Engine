const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const dotenv = require('dotenv');

dotenv.config();


router.post('/', async (req, res) => {
  try {
    const { travel = 0, shopping = 0, fuel = 0, food = 0 } = req.body;

    // Get constants from environment
    const TRAVEL_CONSTANT = parseFloat(process.env.TRAVEL_CONSTANT) || 2;
    const SHOPING_CONSTANT = parseFloat(process.env.SHOPING_CONSTANT) || 3;
    const FUEL_CONSTANT = parseFloat(process.env.FUEL_CONSTANT) || 4;
    const FOOD_CONSTANT = parseFloat(process.env.FOOD_CONSTANT) || 5;

    // Calculate savings for each category
    const travelSavings = travel * 0.4 * TRAVEL_CONSTANT;
    const shoppingSavings = shopping * 0.5 * SHOPING_CONSTANT;
    const fuelSavings = fuel * 0.6 * FUEL_CONSTANT;
    const foodSavings = food * 0.7 * FOOD_CONSTANT;

    // Total savings
    const totalSavings = travelSavings + shoppingSavings + fuelSavings + foodSavings;

    // Get all cards with their category savings
    const [cards] = await pool.execute(`
      SELECT 
        c.id,
        c.card_name,
        c.annual_fees,
        c.joining_fees,
        c.rating,
        c.reviews_count,
        b.bank_name,
        cs.category_key,
        cs.savings_percentage,
        cat.name as category_name
      FROM cards c
      INNER JOIN banks b ON c.bank_id = b.id
      LEFT JOIN category_savings cs ON c.id = cs.card_id
      LEFT JOIN categories cat ON cs.category_key = cat.key
      WHERE c.is_active = 1
      ORDER BY c.id, cs.category_key
    `);

    // If no cards in DB, return mock data
    if (cards.length === 0) {
      const mockCard = {
        card_name: 'HDFC Regalia Gold Credit Card',
        bank_name: 'HDFC Bank',
        rating: 4.5,
        reviews_count: 2847,
        best_for: 'Fuel Spends & Travel',
        total_savings: Math.round(totalSavings),
        annual_fees: 1500,
        net_savings: Math.round(totalSavings - 1500),
        categories: []
      };

      if (travel > 0) {
        mockCard.categories.push({ category: 'Travel', savings: Math.round(travelSavings) });
      }
      if (shopping > 0) {
        mockCard.categories.push({ category: 'Shopping', savings: Math.round(shoppingSavings) });
      }
      if (fuel > 0) {
        mockCard.categories.push({ category: 'Fuel', savings: Math.round(fuelSavings) });
      }
      if (food > 0) {
        mockCard.categories.push({ category: 'Food', savings: Math.round(foodSavings) });
      }

      return res.json([mockCard]);
    }

    // Group cards by card_id
    const cardMap = {};
    cards.forEach(row => {
      if (!cardMap[row.id]) {
        cardMap[row.id] = {
          id: row.id,
          card_name: row.card_name,
          bank_name: row.bank_name,
          rating: row.rating,
          reviews_count: row.reviews_count,
          annual_fees: row.annual_fees,
          joining_fees: row.joining_fees,
          categories: []
        };
      }

      if (row.category_key) {
        cardMap[row.id].categories.push({
          category_key: row.category_key,
          category_name: row.category_name,
          savings_percentage: row.savings_percentage
        });
      }
    });

    // Calculate savings for each card based on user spends
    const results = Object.values(cardMap).map(card => {
      let cardTotalSavings = 0;
      const categorySavings = [];

      // Calculate savings for each category the user has selected
      if (travel > 0) {
        const travelCategory = card.categories.find(c => c.category_key === 'travel');
        if (travelCategory) {
          const savings = travel * (travelCategory.savings_percentage / 100);
          cardTotalSavings += savings;
          categorySavings.push({
            category: travelCategory.category_name || 'Travel',
            savings: Math.round(savings),
            spent: travel
          });
        } else {
          // Use default formula if card doesn't have specific category savings
          const savings = travel * 0.4 * TRAVEL_CONSTANT;
          cardTotalSavings += savings;
          categorySavings.push({
            category: 'Travel',
            savings: Math.round(savings),
            spent: travel
          });
        }
      }

      if (shopping > 0) {
        const shoppingCategory = card.categories.find(c => c.category_key === 'shopping');
        if (shoppingCategory) {
          const savings = shopping * (shoppingCategory.savings_percentage / 100);
          cardTotalSavings += savings;
          categorySavings.push({
            category: shoppingCategory.category_name || 'Shopping',
            savings: Math.round(savings),
            spent: shopping
          });
        } else {
          const savings = shopping * 0.5 * SHOPING_CONSTANT;
          cardTotalSavings += savings;
          categorySavings.push({
            category: 'Shopping',
            savings: Math.round(savings),
            spent: shopping
          });
        }
      }

      if (fuel > 0) {
        const fuelCategory = card.categories.find(c => c.category_key === 'fuel');
        if (fuelCategory) {
          const savings = fuel * (fuelCategory.savings_percentage / 100);
          cardTotalSavings += savings;
          categorySavings.push({
            category: fuelCategory.category_name || 'Fuel',
            savings: Math.round(savings),
            spent: fuel
          });
        } else {
          const savings = fuel * 0.6 * FUEL_CONSTANT;
          cardTotalSavings += savings;
          categorySavings.push({
            category: 'Fuel',
            savings: Math.round(savings),
            spent: fuel
          });
        }
      }

      if (food > 0) {
        const foodCategory = card.categories.find(c => c.category_key === 'food');
        if (foodCategory) {
          const savings = food * (foodCategory.savings_percentage / 100);
          cardTotalSavings += savings;
          categorySavings.push({
            category: foodCategory.category_name || 'Food',
            savings: Math.round(savings),
            spent: food
          });
        } else {
          const savings = food * 0.7 * FOOD_CONSTANT;
          cardTotalSavings += savings;
          categorySavings.push({
            category: 'Food',
            savings: Math.round(savings),
            spent: food
          });
        }
      }

      // Determine best_for category based on highest savings
      const bestCategory = categorySavings.reduce((max, cat) => 
        cat.savings > max.savings ? cat : max, categorySavings[0] || { category: 'General', savings: 0 }
      );

      return {
        id: card.id,
        card_name: card.card_name,
        bank_name: card.bank_name,
        rating: card.rating,
        reviews_count: card.reviews_count,
        best_for: `${bestCategory.category} Spends${categorySavings.length > 1 ? ' & More' : ''}`,
        total_savings: Math.round(cardTotalSavings),
        annual_fees: card.annual_fees,
        net_savings: Math.round(cardTotalSavings - card.annual_fees),
        categories: categorySavings
      };
    });

    // Sort by net savings (descending) and return top cards
    results.sort((a, b) => b.net_savings - a.net_savings);

    res.json(results);
  } catch (error) {
    console.error('Error calculating savings:', error);
    res.status(500).json({ error: 'Failed to calculate savings', message: error.message });
  }
});

module.exports = router;

