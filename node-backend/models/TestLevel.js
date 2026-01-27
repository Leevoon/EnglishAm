const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TestLevel = sequelize.define('TestLevel', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  status: {
    type: DataTypes.TINYINT(1),
    allowNull: false,
    defaultValue: 1
  },
  sort_order: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  created_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'test_level',
  timestamps: false
});

module.exports = TestLevel;



