"use strict";

const categories = [
  {
    name: "Taman Hiburan",
    description:
      "Tempat rekreasi yang menyediakan hiburan dan aktivitas bagi pengunjung.",
  },
  {
    name: "Budaya",
    description:
      "Warisan dan praktik yang diwariskan dari generasi ke generasi.",
  },
  {
    name: "Cagar Alam",
    description:
      "Area alami yang dilindungi untuk melestarikan keanekaragaman hayati dan ekosistem.",
  },
  {
    name: "Bahari",
    description:
      "Segala sesuatu yang terkait dengan laut dan kehidupan di dalamnya.",
  },
  {
    name: "Tempat Ibadah",
    description:
      "Lokasi yang digunakan untuk melaksanakan ibadah dan aktivitas keagamaan.",
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */

    await queryInterface.bulkInsert(
      "Categories",
      categories.map((data) => {
        data.createdAt = new Date();
        data.updatedAt = new Date();
        return data;
      }),
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete("Categories", null, {});
  },
};
