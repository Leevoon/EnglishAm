const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserHasMembership = sequelize.define('UserHasMembership', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  },
  membership_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  }
}, {
  tableName: 'user_has_membership',
  timestamps: false
});

module.exports = UserHasMembership;
