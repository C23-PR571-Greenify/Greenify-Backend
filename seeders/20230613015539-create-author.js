"use strict";

const authors = [
  {
    fullname: "Winda Asmarawati",
    bangkit_id: "M220DSY0063",
    path: "Machine Learning",
    linkedIn: "https://www.linkedin.com/in/windaasmarawati/",
    github: "https://github.com/windaasm",
    profile_url: "1",
  },
  {
    fullname: "Grace Cynthia",
    bangkit_id: "M287DSY0009",
    path: "Machine Learning",
    linkedIn: "https://www.linkedin.com/in/gracecynthia9850/",
    github: "https://github.com/graceecyn",
    profile_url: "2",
  },
  {
    fullname: "Judah Ariesaka Magaini",
    bangkit_id: "M181DSX2562",
    path: "Machine Learning",
    linkedIn: "https://www.linkedin.com/in/judah-ariesaka/",
    github: "https://github.com/ariiesaka",
    profile_url: "3",
  },
  {
    fullname: "Moh. Bahrul Ulum",
    bangkit_id: "A063DSX1211",
    path: "Mobile Development",
    linkedIn: "https://www.linkedin.com/in/moh-bahrul-ulum-ab52721b7/",
    github: "https://github.com/MohBahrulUlum15",
    profile_url: "4",
  },
  {
    fullname: "Muhamad Zulfikar Nurdiana",
    bangkit_id: "C220DSX0972",
    path: "Cloud Computing",
    linkedIn: "https://www.linkedin.com/in/zulnurdiana/",
    github: "https://github.com/zulnurdiana",
    profile_url: "5",
  },
  {
    fullname: "Muhammad Aziz Rosyid Hidayat",
    bangkit_id: "C306DSX1377",
    path: "Cloud Computing",
    linkedIn: "https://www.linkedin.com/in/azizrosyid/",
    github: "https://github.com/azizrosyid",
    profile_url: "6",
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "author",
      authors.map((data) => {
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
    await queryInterface.bulkDelete("author", null, {});
  },
};
