const express = require("express");
const {
  postLoginHandler,
  getLogoutHandler,
  generateAccessTokenHandler,
  verifyOTP,
  resendOTPVerificationEmail,
} = require("./handler");

const router = express.Router();

router.post("/login", postLoginHandler);
router.get("/logout", getLogoutHandler);
router.get("/token", generateAccessTokenHandler);
router.post("/verifyotp", verifyOTP);
router.post("/resendotp", resendOTPVerificationEmail);

module.exports = router;
