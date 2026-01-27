const { DataTypes, Op } = require('sequelize');
const sequelize = require('../config/database');
const crypto = require('crypto');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  block: {
    type: DataTypes.TINYINT(1),
    allowNull: false,
    defaultValue: 0,
    comment: '0-false, 1-true'
  },
  user_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'md5'
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  first_name: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  last_name: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  gender: {
    type: DataTypes.TINYINT(1),
    allowNull: false,
    defaultValue: 1,
    comment: '1=male,2=female'
  },
  dob: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  avatar: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  created_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  last_login_date: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'users',
  timestamps: false
});

// Helper method to hash password with MD5 (for compatibility with existing PHP system)
User.hashPassword = function(password) {
  return crypto.createHash('md5').update(password).digest('hex');
};

// Helper method to authenticate user
User.authenticate = async function(usernameOrEmail, password) {
  const hashedPassword = this.hashPassword(password);
  const user = await User.findOne({
    where: {
      [Op.or]: [
        { user_name: usernameOrEmail },
        { email: usernameOrEmail }
      ],
      password: hashedPassword,
      block: 0
    }
  });
  return user;
};

module.exports = User;

