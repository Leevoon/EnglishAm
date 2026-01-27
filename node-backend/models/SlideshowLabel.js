const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SlideshowLabel = sequelize.define('SlideshowLabel', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  slideshow_id: {
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
  tableName: 'slideshow_label',
  timestamps: false
});

module.exports = SlideshowLabel;



