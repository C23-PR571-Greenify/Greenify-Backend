const jwt = require("jsonwebtoken");
const config = require("../config/config");

module.exports = {
  verifyToken: (req, res, next) => {
    const { accessTokenSecret: accessSecret } = config.jwt;
    const authHeader = req.headers["authorization"];
    const Token = authHeader && authHeader.split(" ")[1];

    if (!Token) return res.sendStatus(401);
    jwt.verify(Token, accessSecret, (err, decode) => {
      if (err) return res.status(403).json({ msg: "Please login first" });
      req.email = decode.email;
      next();
    });
  },
};
