const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const News = sequelize.define('News', {
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
  view_count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  image: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  video: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  type: {
    type: DataTypes.TINYINT(1),
    allowNull: false,
    defaultValue: 1,
    comment: '1=image, 2=video'
  }
}, {
  tableName: 'news',
  timestamps: false
});

module.exports = News;



