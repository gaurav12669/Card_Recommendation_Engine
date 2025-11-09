const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

// Create connection pool for better performance
// Handle empty password correctly - only include password if explicitly set
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  database: process.env.DB_NAME || 'card_genius',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Only include password if it's explicitly set AND not empty
// If DB_PASSWORD is empty string, don't include it (MySQL will use no password)
if (process.env.DB_PASSWORD && process.env.DB_PASSWORD.trim() !== '') {
  dbConfig.password = process.env.DB_PASSWORD;
}

const pool = mysql.createPool(dbConfig);

// Test connection
pool.getConnection()
  .then(connection => {
    console.log('✅ Database connected successfully');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err.message);
  });

module.exports = pool;