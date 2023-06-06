"use strict";

const tourismJson = require("./tourism.json");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("tourism", tourismJson);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("tourism", null, {});
  },
};
