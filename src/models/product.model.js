module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('Product', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "O nome do produto é obrigatório"
          },
          len: {
            args: [3, 100],
            msg: "O nome do produto deve ter entre 3 e 100 caracteres"
          }
        }
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          isDecimal: {
            msg: "O preço deve ser um número decimal"
          },
          min: {
            args: [0.01],
            msg: "O preço deve ser maior que zero"
          }
        }
      },
      inStock: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'in_stock'
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'image_url'
      }
    }, {
      tableName: 'products',
      timestamps: true,
      underscored: true
    });
  
    return Product;
  };