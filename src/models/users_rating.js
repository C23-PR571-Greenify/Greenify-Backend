const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class users_rating extends Model {
    static associate() {
      users_rating.belongsTo(sequelize.models.User, { foreignKey: "user_id" });
      users_rating.belongsTo(sequelize.models.Tourism, {
        foreignKey: "tourism_id",
      });
    }
  }

  users_rating.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      tourism_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      rating: {
        type: DataTypes.FLOAT,
        allowNull: true,
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

  return users_rating;
};
