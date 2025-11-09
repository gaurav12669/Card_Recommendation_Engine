const dbClient = require('../lib/MySQLClient');

class CardModel {
  static async findActiveCardsWithSavings() {
    const pool = dbClient.getPool();
    const [rows] = await pool.query(
      `SELECT 
        c.id,
        c.card_name,
        c.annual_fees,
        c.joining_fees,
        c.reward_points,
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
      ORDER BY c.id, cs.category_key`
    );
    return rows;
  }

  static async findCardById(cardId) {
    const pool = dbClient.getPool();
    const [[card]] = await pool.query(
      `SELECT 
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
      WHERE c.id = ? AND c.is_active = 1`,
      [cardId]
    );

    if (!card) {
      return null;
    }

    const [features] = await pool.query(
      `SELECT feature_title, feature_description
       FROM card_features
       WHERE card_id = ?
       ORDER BY id`,
      [cardId]
    );

    const [[eligibility]] = await pool.query(
      `SELECT 
        min_age,
        max_age,
        min_income,
        min_cibil_score
      FROM eligibility_criteria
      WHERE card_id = ?
      LIMIT 1`,
      [cardId]
    );

    const [categorySavings] = await pool.query(
      `SELECT 
        cat.name as category_name,
        cs.savings_percentage
      FROM category_savings cs
      INNER JOIN categories cat ON cs.category_key = cat.key
      WHERE cs.card_id = ?
      ORDER BY cat.name`,
      [cardId]
    );

    return {
      ...card,
      features,
      eligibility: eligibility || null,
      category_savings: categorySavings,
    };
  }
}

module.exports = CardModel;

