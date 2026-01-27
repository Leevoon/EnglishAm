const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Test = sequelize.define('Test', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  parent_id: {
    type: DataTypes.INTEGER.UNSIGNED,
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
  question_type: {
    type: DataTypes.TINYINT(1),
    allowNull: true,
    defaultValue: 1,
    comment: '1-text, 2-image'
  },
  answer_type: {
    type: DataTypes.TINYINT(1),
    allowNull: true,
    defaultValue: 1,
    comment: '1-text, 2-image'
  },
  image: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  audio: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  question: {
    type: DataTypes.TEXT,
    allowNull: true
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
  }
}, {
  tableName: 'test',
  timestamps: false
});

module.exports = Test;



