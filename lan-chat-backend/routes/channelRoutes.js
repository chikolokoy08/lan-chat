const express = require('express');
const { createOrGetChannel, saveMessage, getMessage } = require('../controllers/channelController');
const authenticateToken = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/create', authenticateToken, createOrGetChannel);
router.post('/send', authenticateToken, saveMessage);
router.post('/ping', authenticateToken, getMessage);

module.exports = router;
