const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TestAnswer = sequelize.define('TestAnswer', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  test_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  },
  true_false: {
    type: DataTypes.TINYINT(1),
    allowNull: false,
    defaultValue: 0,
    comment: '0-false, 1-true'
  },
  value: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'test_answer',
  timestamps: false
});

module.exports = TestAnswer;



