const pool = require('../config/database');
const dotenv = require('dotenv');

dotenv.config();

async function seedDatabase() {
  try {
    // Seed categories
    console.log('Seeding categories...');
    await pool.execute(`
      INSERT IGNORE INTO categories (\`key\`, name) VALUES
      ('travel', 'Travel'),
      ('shopping', 'Shopping'),
      ('fuel', 'Fuel'),
      ('food', 'Food')
    `);

    // Seed banks
    console.log('Seeding banks...');
    await pool.execute(`
      INSERT IGNORE INTO banks (bank_name) VALUES
      ('HDFC Bank'),
      ('ICICI Bank'),
      ('Axis Bank'),
      ('SBI Bank')
    `);

    // Get bank IDs
    const [banks] = await pool.execute('SELECT id, bank_name FROM banks ORDER BY id');
    const bankMap = {};
    banks.forEach(bank => {
      bankMap[bank.bank_name] = bank.id;
    });

    // Seed cards
    console.log('Seeding cards...');
    await pool.execute(`
      INSERT IGNORE INTO cards (bank_id, card_name, annual_fees, joining_fees, reward_points, rating, reviews_count) VALUES
      (?, 'HDFC Regalia Gold Credit Card', 1500, 2500, '4X', 4.5, 2847),
      (?, 'ICICI Bank Sapphiro Credit Card', 2000, 3000, '5X', 4.3, 1923),
      (?, 'Axis Bank Magnus Credit Card', 10000, 0, '12X', 4.7, 3456),
      (?, 'SBI Card Elite Credit Card', 4999, 0, '6X', 4.2, 1523)
    `, [
      bankMap['HDFC Bank'],
      bankMap['ICICI Bank'],
      bankMap['Axis Bank'],
      bankMap['SBI Bank']
    ]);

    // Get card IDs
    const [cards] = await pool.execute('SELECT id, card_name FROM cards ORDER BY id');
    const cardMap = {};
    cards.forEach(card => {
      cardMap[card.card_name] = card.id;
    });

    // Seed card features
    console.log('Seeding card features...');
    await pool.execute(`
      INSERT IGNORE INTO card_features (card_id, feature_title, feature_description) VALUES
      (?, '4X reward points on dining', 'Earn accelerated rewards on restaurant spends'),
      (?, '2X on online shopping', 'Double rewards on e-commerce purchases'),
      (?, 'Complimentary airport lounge', '4 domestic + 2 international per year'),
      (?, '5X reward points on travel', 'Maximize rewards on travel bookings'),
      (?, '3X on fuel purchases', 'Extra rewards at fuel stations'),
      (?, '12X reward points on dining', 'Premium dining rewards'),
      (?, 'Complimentary golf', 'Access to premium golf courses'),
      (?, '6X reward points on shopping', 'Enhanced shopping rewards'),
      (?, 'Complimentary spa access', 'Relaxation benefits')
    `, [
      cardMap['HDFC Regalia Gold Credit Card'],
      cardMap['HDFC Regalia Gold Credit Card'],
      cardMap['HDFC Regalia Gold Credit Card'],
      cardMap['ICICI Bank Sapphiro Credit Card'],
      cardMap['ICICI Bank Sapphiro Credit Card'],
      cardMap['Axis Bank Magnus Credit Card'],
      cardMap['Axis Bank Magnus Credit Card'],
      cardMap['SBI Card Elite Credit Card'],
      cardMap['SBI Card Elite Credit Card']
    ]);

    // Seed eligibility criteria
    console.log('Seeding eligibility criteria...');
    await pool.execute(`
      INSERT IGNORE INTO eligibility_criteria (card_id, min_age, max_age, min_income, min_cibil_score) VALUES
      (?, 21, 60, 500000, 750),
      (?, 21, 65, 600000, 750),
      (?, 25, 65, 1800000, 800),
      (?, 21, 60, 800000, 750)
    `, [
      cardMap['HDFC Regalia Gold Credit Card'],
      cardMap['ICICI Bank Sapphiro Credit Card'],
      cardMap['Axis Bank Magnus Credit Card'],
      cardMap['SBI Card Elite Credit Card']
    ]);

    // Seed category savings
    console.log('Seeding category savings...');
    const hdfcId = cardMap['HDFC Regalia Gold Credit Card'];
    const iciciId = cardMap['ICICI Bank Sapphiro Credit Card'];
    const axisId = cardMap['Axis Bank Magnus Credit Card'];
    const sbiId = cardMap['SBI Card Elite Credit Card'];
    
    // Insert each card's category savings separately to avoid parameter mismatch
    await pool.execute(`
      INSERT IGNORE INTO category_savings (card_id, category_key, savings_percentage) VALUES
      (?, 'travel', 9.0),
      (?, 'shopping', 9.0),
      (?, 'fuel', 9.0),
      (?, 'food', 8.0)
    `, [hdfcId, hdfcId, hdfcId, hdfcId]);
    
    await pool.execute(`
      INSERT IGNORE INTO category_savings (card_id, category_key, savings_percentage) VALUES
      (?, 'travel', 10.0),
      (?, 'shopping', 8.0),
      (?, 'fuel', 7.0),
      (?, 'food', 9.0)
    `, [iciciId, iciciId, iciciId, iciciId]);
    
    await pool.execute(`
      INSERT IGNORE INTO category_savings (card_id, category_key, savings_percentage) VALUES
      (?, 'travel', 12.0),
      (?, 'shopping', 10.0),
      (?, 'fuel', 8.0),
      (?, 'food', 11.0)
    `, [axisId, axisId, axisId, axisId]);
    
    await pool.execute(`
      INSERT IGNORE INTO category_savings (card_id, category_key, savings_percentage) VALUES
      (?, 'travel', 8.0),
      (?, 'shopping', 9.0),
      (?, 'fuel', 7.0),
      (?, 'food', 8.5)
    `, [sbiId, sbiId, sbiId, sbiId]);

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    // Don't close the pool here as it's shared
    // await pool.end();
  }
}

// Run if executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = seedDatabase;
