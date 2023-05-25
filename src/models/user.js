const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate() {
      // define association here
      User.hasMany(sequelize.models.otpToken, { foreignKey: "user_id" });
    }
  }

  User.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
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
