const express = require("express");
const {
  getAllUsersHandler,
  getSingleUser,
  Registration,
  deleteUser,
  updateUser,
} = require("./handler");

const { verifyToken } = require("../../middleware/VerifyToken");

const router = express.Router();

router.get("/", verifyToken, getAllUsersHandler);
router.get("/:id", getSingleUser);
router.post("/signup", Registration);
router.delete("/:id", deleteUser);
router.put("/:id", updateUser);

module.exports = router;
