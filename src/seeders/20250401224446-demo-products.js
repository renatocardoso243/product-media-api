'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('products', [
      {
        name: 'Apple MacBook Pro 14"',
        description: 'Laptop potente com chip M3 Pro.',
        price: 1999.99,
        in_stock: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Samsung Galaxy S24 Ultra',
        description: 'Smartphone premium com câmera avançada.',
        price: 1299.99,
        in_stock: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Sony WH-1000XM5',
        description: 'Fone de ouvido com cancelamento de ruído.',
        price: 399.99,
        in_stock: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'NVIDIA GeForce RTX 4090',
        description: 'Placa de vídeo de alto desempenho.',
        price: 1599.99,
        in_stock: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Apple iPad Pro 12.9"',
        description: 'Tablet poderoso com tela Liquid Retina XDR.',
        price: 1099.99,
        in_stock: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('products', null, {});
  }
};
