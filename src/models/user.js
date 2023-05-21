const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate() {
      // define association here
    }
  }

  User.init(
    {
      fullname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      refresh_token: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
    }
  );

  // (async () => {
  //   await User.sync({ force: true });
  //   console.log("All models were synchronized successfully.");
  // })();

  return User;
};
