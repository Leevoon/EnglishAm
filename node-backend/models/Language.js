const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Language = sequelize.define('Language', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(25),
    allowNull: false
  },
  iso: {
    type: DataTypes.STRING(5),
    allowNull: false
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
  image: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  tableName: 'languages',
  timestamps: false
});

module.exports = Language;



