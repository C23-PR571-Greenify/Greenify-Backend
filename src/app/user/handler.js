const { User } = require("../../models");

async function getAllUsersHandler(req, res) {
  let test = "";
  const users = await User.findAll();
  return res.json(users);
}

module.exports = {
  getAllUsersHandler,
};
