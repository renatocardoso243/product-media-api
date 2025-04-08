const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  class User extends Model {
    static async hashPassword(password) {
      return bcrypt.hash(password, 10);
    }
  }

  User.init({
    name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true,
      validate: { isEmail: true }
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('user', 'admin'),
      defaultValue: 'user'
    }
  }, {
    sequelize,
    hooks: {
      beforeSave: async (user) => {
        if (user.changed('password')) {
          user.password = await User.hashPassword(user.password);
        }
      }
    }
  });

  return User;
};