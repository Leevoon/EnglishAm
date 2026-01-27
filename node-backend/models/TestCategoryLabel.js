const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TestCategoryLabel = sequelize.define('TestCategoryLabel', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  test_category_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  },
  language_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  seo_name: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  tableName: 'test_category_label',
  timestamps: false
});

module.exports = TestCategoryLabel;



