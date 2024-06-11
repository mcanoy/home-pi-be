const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', process.env.DB_USER, process.env.DB_PASSWORD, {
  dialect: 'sqlite',
  host: 'localhost',
  storage: process.env.DATABASE_NAME,
  logging: console.log,
});

module.exports = sequelize;