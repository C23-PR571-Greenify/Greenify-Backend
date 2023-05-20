require('dotenv').config();

module.exports = {
  jwt: {
    accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
    accessTokenLife: process.env.JWT_ACCESS_TOKEN_LIFE,
  },
};
