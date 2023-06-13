const express = require("express");
const handler = require("./handler");
const router = express.Router();

router.get("/", handler.getAllAuthorHandler);

module.exports = router;
