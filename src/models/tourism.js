"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Tourism extends Model {
    static associate(models) {
      Tourism.belongsTo(models.Category, { foreignKey: "category_id" });
    }
  }
  Tourism.init(
    {
      place_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      rating: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      lat: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      lng: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "Tourism",
      tableName: "tourism",
    }
  );
  return Tourism;
};
