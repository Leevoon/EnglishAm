const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Membership = sequelize.define('Membership', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  status: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  sort_ortder: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  vip: {
    type: DataTypes.TINYINT(1),
    allowNull: true,
    defaultValue: 0
  },
  level: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: '0=free, 1=silver, 2=gold'
  }
}, {
  tableName: 'membership',
  timestamps: false
});

module.exports = Membership;



