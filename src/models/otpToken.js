const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class otpToken extends Model {
    static associate() {
      otpToken.belongsTo(sequelize.models.User, { foreignKey: "user_id" });
    }
  }

  otpToken.init(
    {
      token_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      otp: {
        type: DataTypes.STRING,
      },
      createdAt: {
        type: DataTypes.DATE,
      },
      expiresAt: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
    }
  );

  // (async () => {
  //   await otpToken.sync({ force: true });
  //   console.log("All models were synchronized successfully.");
  // })();

  return otpToken;
};
