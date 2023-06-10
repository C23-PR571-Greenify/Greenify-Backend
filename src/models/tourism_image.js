"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class tourism_image extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Tourism, { foreignKey: "tourism_id" });
    }
  }
  tourism_image.init(
    {
      image_url: DataTypes.STRING,
      tourism_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "tourism",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "tourism_image",
    }
  );
  return tourism_image;
};
