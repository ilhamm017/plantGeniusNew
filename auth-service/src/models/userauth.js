'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserAuth extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserAuth.init({
    email: {
      type: DataTypes.STRING,
      allowNull:false,
      unique: true,
      validate: {
        isEmail: {
          msg:'Format email tidak valid'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false, 
    }
  }, {
    sequelize,
    modelName: 'UserAuth',
  });
  return UserAuth;
};