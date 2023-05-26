const express = require("express");
const {
  getAllUsersHandler,
  getSingleUser,
  Registration,
  deleteUser,
  updateUser,
  forgotPassword,
} = require("./handler");

const { verifyToken } = require("../../middleware/VerifyToken");

const router = express.Router();

router.get("/", getAllUsersHandler);
router.get("/:id", getSingleUser);
router.post("/signup", Registration);
router.delete("/:id", deleteUser);
router.put("/:id", updateUser);
router.post("/forgotpassword", forgotPassword);

module.exports = router;
