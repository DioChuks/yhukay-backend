const config = require('./environment');
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(config.mysql.database, config.mysql.user, config.mysql.password, {
  host: config.mysql.host,
  port: config.mysql.port,
  dialect: config.mysql.dialect,
});

module.exports = sequelize;
