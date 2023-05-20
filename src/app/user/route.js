const express = require('express');
const { getAllUsersHandler } = require('./handler');

const router = express.Router();

router.get('/', getAllUsersHandler);

module.exports = router;
