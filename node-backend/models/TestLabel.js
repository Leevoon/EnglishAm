const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TestLabel = sequelize.define('TestLabel', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  test_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  },
  language_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  },
  value: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'test_label',
  timestamps: false
});

module.exports = TestLabel;



