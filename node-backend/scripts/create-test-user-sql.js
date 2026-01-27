const sequelize = require('../config/database');
const crypto = require('crypto');

async function createTestUser() {
  try {
    // Hash password using MD5 (same as PHP system)
    const password = crypto.createHash('md5').update('test123').digest('hex');
    
    // Check if user already exists
    const [existingUsers] = await sequelize.query(`
      SELECT id, user_name, email 
      FROM users 
      WHERE user_name = 'testuser' OR email = 'test@example.com'
      LIMIT 1
    `);

    if (existingUsers.length > 0) {
      console.log('✓ Test user already exists:');
      console.log('Username:', existingUsers[0].user_name);
      console.log('Email:', existingUsers[0].email);
      console.log('Password: test123');
      console.log('User ID:', existingUsers[0].id);
      process.exit(0);
    }

    // Create the user using raw SQL
    const [result] = await sequelize.query(`
      INSERT INTO users (user_name, email, password, first_name, last_name, gender, block, created_date)
      VALUES ('testuser', 'test@example.com', :password, 'Test', 'User', 1, 0, NOW())
    `, {
      replacements: { password },
      type: sequelize.QueryTypes.INSERT
    });

    const [newUser] = await sequelize.query(`
      SELECT id, user_name, email, first_name, last_name 
      FROM users 
      WHERE user_name = 'testuser'
      LIMIT 1
    `);

    console.log('✓ Test user created successfully!');
    console.log('');
    console.log('Credentials:');
    console.log('Username: testuser');
    console.log('Email: test@example.com');
    console.log('Password: test123');
    console.log('User ID:', newUser[0].id);
    console.log('Name:', newUser[0].first_name, newUser[0].last_name);
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating test user:', error.message);
    process.exit(1);
  }
}

// Run the script
createTestUser();



