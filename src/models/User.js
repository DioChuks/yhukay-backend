// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  emailVerifiedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  otp: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: true, // Automatically manages `created_at` and `updated_at`
  underscored: true, // Allows Sequelize to map camelCase field names to snake_case columns
});

module.exports = User;
