const express = require('express');
const { postLoginHandler } = require('./handler');

const router = express.Router();

router.post('/login', postLoginHandler);

module.exports = router;
