const { User } = require('../../models');

async function getAllUsersHandler(req, res) {
  const users = await User.findAll();
  return res.json(users);
}

module.exports = {
  getAllUsersHandler,
};
