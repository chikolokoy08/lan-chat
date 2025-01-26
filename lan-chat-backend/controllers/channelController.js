const db = require('../models/db');

// Create a Channel
exports.createChannel = async (req, res) => {
    const { channel_key } = req.body;
    try {
        await db.query('INSERT INTO channels (channel_key) VALUES (?)', [channel_key]);
        res.status(201).json({ message: 'Channel created successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
