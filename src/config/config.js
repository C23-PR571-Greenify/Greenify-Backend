require("dotenv").config();

module.exports = {
  jwt: {
    accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
    refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
    accessTokenLife: process.env.JWT_ACCESS_TOKEN_LIFE,
    refreshTokenLife: process.env.JWT_REFRESH_TOKEN_LIFE,
  },
};
