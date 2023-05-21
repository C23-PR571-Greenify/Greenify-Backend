const jwt = require("jsonwebtoken");
const config = require("../config/config");

module.exports = {
  generateAcessToken: (payload) => {
    const token = jwt.sign(payload, config.jwt.accessTokenSecret, {
      expiresIn: config.jwt.accessTokenLife,
    });
    return token;
  },

  verifyToken: (token, secretKey) => {
    let userData;
    try {
      userData = jwt.verify(token, secretKey);
    } catch (err) {
      return false;
    }
    return userData;
  },
};
