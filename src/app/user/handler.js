const { User } = require("../../models");
const bcrypt = require("bcrypt");

// TODO GET ALL USERS
async function getAllUsersHandler(req, res) {
  try {
    const users = await User.findAll({
      attributes: ["id", "fullname", "username", "email", "phone"],
    });
    if (!users) return res.status(404).json({ msg: "Users is empty" });
    res.status(200).json(users);
  } catch (error) {
    console.log(error.message);
  }
}

// TODO GET SINGLE USER BY ID
async function getSingleUser(req, res) {
  const { id } = req.params;
  try {
    const users = await User.findOne({
      attributes: ["id", "fullname", "username", "email", "phone"],
      where: {
        id: id,
      },
    });
    if (!users)
      return res.status(404).json({ msg: `User with id : ${id} not found` });
    res.status(200).json(users);
  } catch (error) {
    console.log(error.message);
  }
}

// TODO DELETE USER BY ID
async function deleteUser(req, res) {
  const { id } = req.params;
  const singleUser = await User.findOne({
    where: {
      id: id,
    },
  });
  if (!singleUser)
    return res.status(404).json({ msg: `User with id : ${id} not found` });

  try {
    await User.destroy({
      where: {
        id: singleUser.id,
      },
    });
    res.status(200).json({ msg: `User with id : ${id} has beed deleted` });
  } catch (error) {
    console.log(error.message);
  }
}

// TODO UPDATE USER BY ID
async function updateUser(req, res) {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(403);

  const { fullname, username, email, phone } = req.body;
  const { id } = req.params;
  const singleUser = await User.findOne({
    where: {
      id: id,
    },
  });

  if (!singleUser)
    return res.status(404).json({ msg: `User with id : ${id} not found` });
  try {
    await User.update(
      {
        fullname: fullname,
        username: username,
        email: email,
        phone: phone,
      },
      {
        where: {
          id: singleUser.id,
        },
      }
    );
    res.status(200).json({ msg: `User with id : ${id} has beed updated` });
  } catch (error) {
    console.log(error.message);
  }
}

// TODO USER SIGNUP
async function Registration(req, res) {
  const { fullname, username, email, password, phone, confirmPassword } =
    req.body;

  const response = await User.findOne({
    where: {
      email: email,
    },
  });

  if (response) return res.status(400).json({ msg: "Email is exist" });

  if (password !== confirmPassword)
    return res.status(400).json({ msg: "Password doesn't match" });

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hashSync(password, saltRounds);

  try {
    await User.create({
      fullname: fullname,
      username: username,
      email: email,
      password: hashedPassword,
      phone: phone,
    });
    res.status(200).json({ msg: "Success Registration" });
  } catch (error) {
    console.log(error.message);
  }
}

// TODO FORGOT PASSWORD

async function forgotPassword(req, res) {
  const { email, password, confirmPassword } = req.body;

  if (!confirmPassword || !password)
    return res.status(400).json({ msg: "Please input password" });
  if (password !== confirmPassword)
    return res.status(400).json({ msg: "Password doesn't match" });

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hashSync(password, saltRounds);

  const singleUser = await User.findOne({
    where: {
      email: email,
    },
  });
  if (!singleUser)
    return res
      .status(404)
      .json({ msg: `User with email : ${email} not found` });
  try {
    await User.update(
      {
        password: hashedPassword,
      },
      {
        where: {
          id: singleUser.id,
        },
      }
    );
    res.status(200).json({ msg: "Password has been changed" });
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = {
  getAllUsersHandler,
  getSingleUser,
  deleteUser,
  updateUser,
  Registration,
  forgotPassword,
};
