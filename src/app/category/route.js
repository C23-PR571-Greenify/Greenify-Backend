const express = require("express");
const handler = require("./handler");
const router = express.Router();

router.get("/", handler.getAllCategoriesHandler);
router.post("/", handler.createCategory);
router.delete("/:id", handler.deleteCategory);
router.put("/:id", handler.updateCategory);

module.exports = router;
