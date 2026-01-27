const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
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
  key: {
    type: DataTypes.STRING(16),
    allowNull: true
  }
}, {
  tableName: 'category',
  timestamps: false
});

module.exports = Category;



