const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

async function createDatabase() {
  let connection;
  
  try {
    // Connect without specifying database first
    // Handle empty password correctly
    const connectionConfig = {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      port: process.env.DB_PORT || 3306
    };
    
    // Only include password if explicitly set AND not empty
    // If DB_PASSWORD is empty string, don't include it (MySQL will use no password)
    if (process.env.DB_PASSWORD && process.env.DB_PASSWORD.trim() !== '') {
      connectionConfig.password = process.env.DB_PASSWORD;
    }
    
    connection = await mysql.createConnection(connectionConfig);

    const dbName = process.env.DB_NAME || 'card_genius';

    // Create database if it doesn't exist (use query instead of execute for DDL)
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    console.log(`Database '${dbName}' created or already exists`);

    // Close the initial connection
    await connection.end();

    // Create a new connection with the database specified
    const dbConnectionConfig = {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      port: process.env.DB_PORT || 3306,
      database: dbName
    };
    
    // Only include password if explicitly set AND not empty
    // If DB_PASSWORD is empty string, don't include it (MySQL will use no password)
    if (process.env.DB_PASSWORD && process.env.DB_PASSWORD.trim() !== '') {
      dbConnectionConfig.password = process.env.DB_PASSWORD;
    }
    
    connection = await mysql.createConnection(dbConnectionConfig);

    // Create categories table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        \`key\` VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_key (\`key\`),
        INDEX idx_active (is_active)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    // Create banks table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS banks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        bank_name VARCHAR(100) NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_name (bank_name)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    // Create cards table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS cards (
        id INT AUTO_INCREMENT PRIMARY KEY,
        bank_id INT NOT NULL,
        card_name VARCHAR(200) NOT NULL,
        annual_fees DECIMAL(10, 2) DEFAULT 0,
        joining_fees DECIMAL(10, 2) DEFAULT 0,
        reward_points VARCHAR(50),
        rating DECIMAL(3, 2) DEFAULT 0,
        reviews_count INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (bank_id) REFERENCES banks(id) ON DELETE CASCADE,
        INDEX idx_bank (bank_id),
        INDEX idx_active (is_active),
        INDEX idx_rating (rating)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    // Create card_features table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS card_features (
        id INT AUTO_INCREMENT PRIMARY KEY,
        card_id INT NOT NULL,
        feature_title VARCHAR(200) NOT NULL,
        feature_description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE,
        INDEX idx_card (card_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    // Create eligibility_criteria table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS eligibility_criteria (
        id INT AUTO_INCREMENT PRIMARY KEY,
        card_id INT NOT NULL,
        min_age INT,
        max_age INT,
        min_income DECIMAL(12, 2),
        min_cibil_score INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE,
        UNIQUE KEY unique_card (card_id),
        INDEX idx_card (card_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    // Create category_savings table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS category_savings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        card_id INT NOT NULL,
        category_key VARCHAR(50) NOT NULL,
        savings_percentage DECIMAL(5, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE,
        FOREIGN KEY (category_key) REFERENCES categories(\`key\`) ON DELETE CASCADE,
        UNIQUE KEY unique_card_category (card_id, category_key),
        INDEX idx_card (card_id),
        INDEX idx_category (category_key)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    console.log('All tables created successfully');

  } catch (error) {
    console.error('Error creating database:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run if executed directly
if (require.main === module) {
  createDatabase()
    .then(() => {
      console.log('Database setup completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Database setup failed:', error);
      process.exit(1);
    });
}

module.exports = createDatabase;
