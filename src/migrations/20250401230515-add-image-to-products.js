'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('products', 'image_url', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn('products', 'image_url');
  }
};