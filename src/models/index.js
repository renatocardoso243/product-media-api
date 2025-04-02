const { Sequelize } = require('sequelize');
const dbConfig = require('../config/database');

const sequelize = new Sequelize(dbConfig);

const models = {
  Product: require('./product.model')(sequelize, Sequelize.DataTypes)
};

// Associações (se houver)

module.exports = {
  ...models,
  sequelize
};