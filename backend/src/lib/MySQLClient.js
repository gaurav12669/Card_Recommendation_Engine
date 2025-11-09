const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

class MySQLClient {
  constructor() {
    // Handle empty password correctly - if DB_PASSWORD is set (even if empty string), use it
    const dbConfig = {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      database: process.env.DB_NAME || 'card_genius',
      port: process.env.DB_PORT || 3306,
      waitForConnections: true,
      connectionLimit: Number(process.env.DB_POOL_LIMIT || 10),
      queueLimit: 0,
    };
    
    // Only include password if it's explicitly set AND not empty
    // If DB_PASSWORD is empty string, don't include it (MySQL will use no password)
    if (process.env.DB_PASSWORD && process.env.DB_PASSWORD.trim() !== '') {
      dbConfig.password = process.env.DB_PASSWORD;
    }
    
    this.pool = mysql.createPool(dbConfig);

    // Test connection asynchronously (non-blocking)
    // This allows the pool to be created even if DB doesn't exist yet (e.g., during setup)
    this.pool
      .getConnection()
      .then((connection) => {
        console.log('Database connected successfully');
        connection.release();
      })
      .catch((err) => {
        // Silently handle initial connection failure (DB might not exist during setup)
        // The pool will still work once the database is created
        if (process.env.NODE_ENV !== 'production') {
          console.log('Database connection test failed (this is OK during initial setup):', err.message);
        }
      });
  }

  static getInstance() {
    if (!MySQLClient.instance) {
      MySQLClient.instance = new MySQLClient();
    }

    return MySQLClient.instance;
  }

  getPool() {
    return this.pool;
  }
}

module.exports = MySQLClient.getInstance();

