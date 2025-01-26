const express = require('express');
const { uploadFile } = require('../controllers/uploadController');
const router = express.Router();

router.post('/', uploadFile, (req, res) => {
    res.status(200).json({ message: 'File uploaded successfully', file: req.file });
});

module.exports = router;
