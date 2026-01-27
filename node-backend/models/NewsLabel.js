const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const NewsLabel = sequelize.define('NewsLabel', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  news_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  },
  language_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  value: {
    type: DataTypes.TEXT('medium'),
    allowNull: true
  }
}, {
  tableName: 'news_label',
  timestamps: false
});

module.exports = NewsLabel;



