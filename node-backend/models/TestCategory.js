const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TestCategory = sequelize.define('TestCategory', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  category_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  },
  parent_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    defaultValue: 0
  },
  status: {
    type: DataTypes.TINYINT(1),
    allowNull: false,
    defaultValue: 1
  },
  created_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  sort_order: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  time: {
    type: DataTypes.TIME,
    allowNull: false,
    defaultValue: '00:10:00'
  },
  view_count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  image: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  level_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true
  },
  english_variant: {
    type: DataTypes.ENUM('american', 'british', 'both'),
    allowNull: true,
    defaultValue: 'both'
  }
}, {
  tableName: 'test_category',
  timestamps: false
});

module.exports = TestCategory;



