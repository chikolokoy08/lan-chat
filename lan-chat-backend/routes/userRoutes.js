const express = require('express');
const { getProfile, getAllUsers } = require('../controllers/userController');
const authenticateToken = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/profile', authenticateToken, getProfile);
router.get('/all', authenticateToken, getAllUsers);

module.exports = router;
