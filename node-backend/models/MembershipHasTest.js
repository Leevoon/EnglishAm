const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MembershipHasTest = sequelize.define('MembershipHasTest', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  membership_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  },
  test_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  },
  type: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: '0=test, 1=toefl_reading, 2=toefl_listening, 3=toefl_speaking, 4=toefl_writing, 5=ielts_reading, 6=ielts_listening, 7=ielts_speaking, 8=ielts_writing'
  }
}, {
  tableName: 'membership_has_test',
  timestamps: false
});

module.exports = MembershipHasTest;
