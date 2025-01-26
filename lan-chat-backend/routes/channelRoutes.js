const express = require('express');
const { createChannel } = require('../controllers/channelController');
const router = express.Router();

router.post('/', createChannel);

module.exports = router;
