const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Produtos',
            version: '1.0.0',
            description: 'API para gerenciamento de produtos com upload de imagens',
        },
        servers: [
            {
                url: 'http://localhost:3000/api',
            }
        ],
        components: {
            schemas: {
                Product: {
                    type: 'object',
                    properties: {
                      id: {
                        type: 'integer',
                        example: 1
                      },
                      name: {
                        type: 'string',
                        example: 'Notebook Dell'
                      },
                      description: {
                        type: 'string',
                        example: 'Notebook Dell Inspiron 15'
                      },
                      price: {
                        type: 'number',
                        format: 'float',
                        example: 4299.99
                      },
                      inStock: {
                        type: 'boolean',
                        example: true
                      },
                      imageUrl: {
                        type: 'string',
                        example: '/images/processed_uuid.jpg'
                      }
                    }
                }
            }
        }
    },
    apis: ['./src/routes/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
}