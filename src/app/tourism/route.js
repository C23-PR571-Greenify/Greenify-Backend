const express = require("express");
const router = express.Router();
const handler = require("./handler");

router.post("/recommendation", handler.predictTourismHandler);
router.get("/", handler.getAllTourismHandler);
router.get("/:id", handler.getSingleTourismHandler);
router.post("/", handler.createTourismHandler);
router.put("/:id", handler.updateTourismHandler);
router.delete("/:id", handler.deleteTourismHandler);

module.exports = router;
