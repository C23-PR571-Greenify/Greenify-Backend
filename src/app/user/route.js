const express = require("express");
const {
  getAllUsersHandler,
  getSingleUser,
  Registration,
  deleteUser,
} = require("./handler");

const router = express.Router();

router.get("/", getAllUsersHandler);
router.get("/:id", getSingleUser);
router.post("/signup", Registration);
router.delete("/:id", deleteUser);

module.exports = router;
