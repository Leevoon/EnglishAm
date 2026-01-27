const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CategoryLabel = sequelize.define('CategoryLabel', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  category_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  },
  language_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  },
  value: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  tableName: 'category_label',
  timestamps: false
});

module.exports = CategoryLabel;



