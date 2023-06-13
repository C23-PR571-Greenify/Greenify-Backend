const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class author extends Model {
    static associate() {}
  }

  author.init(
    {
      fullname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      bangkit_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      path: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      linkedIn: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      github: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "author",
    }
  );

  return author;
};
