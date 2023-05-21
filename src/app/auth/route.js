const express = require("express");
const {
  postLoginHandler,
  getLogoutHandler,
  generateAccessTokenHandler,
} = require("./handler");

const router = express.Router();

router.post("/login", postLoginHandler);
router.get("/logout", getLogoutHandler);
router.get("/token", generateAccessTokenHandler);

module.exports = router;
