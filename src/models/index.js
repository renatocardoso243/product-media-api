const { Sequelize } = require('sequelize');
const dbConfig = require('../config/database');

const sequelize = new Sequelize(dbConfig);

const models = {
  Product: require('./product.model')(sequelize, Sequelize.DataTypes),
  User: require('./user.model')(sequelize, Sequelize.DataTypes)
};

// Associações (se houver)
Object.values(models).forEach(model => {
  if (model.associate) model.associate(models);
});

module.exports = {
  ...models,
  sequelize
};