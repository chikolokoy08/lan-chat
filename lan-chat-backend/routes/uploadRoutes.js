const express = require('express');
const { uploadFile } = require('../controllers/uploadController');
const authenticateToken = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const router = express.Router();

router.post('/', authenticateToken, upload.single('file'), uploadFile, (req, res) => {
    res.status(200).json({ message: 'File uploaded successfully', file: req.file });
});

module.exports = router;
