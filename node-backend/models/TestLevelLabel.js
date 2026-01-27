const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TestLevelLabel = sequelize.define('TestLevelLabel', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  test_level_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  },
  language_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  },
  value: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  seo_name: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  tableName: 'test_level_label',
  timestamps: false
});

module.exports = TestLevelLabel;



