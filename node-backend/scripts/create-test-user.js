const User = require('../models/User');
const sequelize = require('../config/database');
const crypto = require('crypto');

async function createTestUser() {
  try {
    // Test user credentials
    const testUser = {
      user_name: 'testuser',
      email: 'test@example.com',
      password: User.hashPassword('test123'),
      first_name: 'Test',
      last_name: 'User',
      gender: 1,
      block: 0
    };

    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        [require('sequelize').Op.or]: [
          { user_name: testUser.user_name },
          { email: testUser.email }
        ]
      }
    });

    if (existingUser) {
      console.log('Test user already exists:');
      console.log('Username:', existingUser.user_name);
      console.log('Email:', existingUser.email);
      console.log('Password: test123');
      process.exit(0);
    }

    // Create the user
    const user = await User.create(testUser);
    
    console.log('✓ Test user created successfully!');
    console.log('');
    console.log('Credentials:');
    console.log('Username: testuser');
    console.log('Email: test@example.com');
    console.log('Password: test123');
    console.log('User ID:', user.id);
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating test user:', error);
    process.exit(1);
  }
}

// Run the script
createTestUser();



