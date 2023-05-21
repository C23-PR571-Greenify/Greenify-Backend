const { User } = require("../../models");
const bcrypt = require("bcrypt");
const config = require("../../config/config");
const jwt = require("jsonwebtoken");

// TODO USER LOGIN
async function postLoginHandler(req, res) {
  const { email, password } = req.body;

  const {
    accessTokenSecret: accessSecret,
    refreshTokenSecret: refreshSecret,
    accessTokenLife: accessExpiresIn,
    refreshTokenLife: refreshExpiresIn,
  } = config.jwt;

  try {
    const response = await User.findOne({
      where: {
        email: email,
      },
    });

    const Match = await bcrypt.compare(password, response.password);
    if (!Match) return res.status(400).json({ msg: "Password doesn't match" });

    const payloadUser = {
      id: response.id,
      fullname: response.fullname,
      username: response.username,
      email: response.email,
      phone: response.phone,
    };

    const accessToken = jwt.sign(payloadUser, accessSecret, {
      expiresIn: accessExpiresIn,
    });

    const refreshToken = jwt.sign(payloadUser, refreshSecret, {
      expiresIn: refreshExpiresIn,
    });

    await User.update(
      { refresh_token: refreshToken },
      {
        where: {
          id: response.id,
        },
      }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 86400000,
    });

    res.json({ accessToken });
  } catch (error) {
    res.status(400).json({ msg: `User with email : ${email} not found` });
  }
}

// TODO USER LOGOUT
async function getLogoutHandler(req, res) {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(403).json({ msg: "Please login first" });
  try {
    const singleUser = await User.findOne({
      where: {
        refresh_token: refreshToken,
      },
    });
    if (!singleUser) return res.status(403).json({ msg: "User not found" });
    await User.update(
      { refresh_token: null },
      {
        where: {
          id: singleUser.id,
        },
      }
    );

    res.clearCookie("refreshToken");

    res.status(200).json({ msg: "Logout Success" });
  } catch (error) {
    console.log(error.message);
  }
}

// TODO GENERATE ACCESS TOKEN
async function generateAccessTokenHandler(req, res) {
  try {
    const {
      accessTokenSecret: accessSecret,
      refreshTokenSecret: refreshSecret,
      accessTokenLife: accessExpiresIn,
    } = config.jwt;

    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
      return res.status(403).json({ msg: "Please login first" });

    const singleUser = await User.findOne({
      where: {
        refresh_token: refreshToken,
      },
    });
    if (!singleUser) return res.status(404).json({ msg: "User not found" });

    const payloadUser = {
      id: singleUser.id,
      fullname: singleUser.fullname,
      username: singleUser.username,
      email: singleUser.email,
      phone: singleUser.phone,
    };

    jwt.verify(refreshToken, refreshSecret, (err, decode) => {
      if (err) return res.sendStatus(403);
      const accessToken = jwt.sign(payloadUser, accessSecret, {
        expiresIn: accessExpiresIn,
      });

      res.json({ accessToken });
    });
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = {
  postLoginHandler,
  generateAccessTokenHandler,
  getLogoutHandler,
};
