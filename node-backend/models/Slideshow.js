const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Slideshow = sequelize.define('Slideshow', {
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
  },
  href: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  tableName: 'slideshow',
  timestamps: false
});

module.exports = Slideshow;



