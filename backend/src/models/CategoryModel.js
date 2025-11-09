const dbClient = require('../lib/MySQLClient');

class CategoryModel {
  static async findActive() {
    const pool = dbClient.getPool();
    const [rows] = await pool.query(
      'SELECT id, `key`, name FROM categories WHERE is_active = 1 ORDER BY id'
    );
    return rows;
  }
}

module.exports = CategoryModel;

