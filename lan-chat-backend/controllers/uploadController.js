const db = require('../models/db');
const { decryptChannelKey } = require('../utils/cryptoUtils');
const fs = require('fs'); // For file system operations (if needed)

// Upload file to a channel
exports.uploadFile = async (req, res) => {
    console.log(req);
    let { channel_key, user_ids } = req.body;
    console.log(typeof user_ids);
    user_ids = typeof user_ids == 'string' ? JSON.parse(user_ids) : user_ids;
    const userId = req.user.id;
    const file = req.file;

    // Validate input
    if (!channel_key || !Array.isArray(user_ids) || !file) {
        return res.status(400).json({ message: 'Invalid input. Provide channel_key, user_ids, and a file.' });
    }

    try {
        // Decrypt the channel_key to verify the user_ids
        const decryptedUserIds = decryptChannelKey(channel_key);
        const sortedUserIds = user_ids.sort((a, b) => a - b);

        if (
            decryptedUserIds.length !== sortedUserIds.length ||
            !decryptedUserIds.includes(userId) ||
            !sortedUserIds.includes(userId)
        ) {
            return res.status(400).json({ message: 'Invalid channel_key or user_ids mismatch.' });
        }

        // Check if the channel exists and the user is part of it
        const [channelRows] = await db.query(`SELECT * FROM channels WHERE channel_key = ? ORDER BY page DESC LIMIT 1`, [channel_key]);
        if (channelRows.length === 0) {
            return res.status(404).json({ message: 'Channel does not exist.' });
        }

        const channel = channelRows[0];

        // Parse the existing thread (if null, initialize as an empty array)
        let threads = channel.threads ? JSON.parse(channel.threads) : [];

        // Add the uploaded file to the thread
        const newMessage = {
            sender_id: userId,
            content: `File uploaded: ${file.originalname}`, // File name or additional metadata
            file_url: `/uploads/${file.filename}`, // Replace with your actual file storage path
            timestamp: new Date().toISOString(),
        };
        threads.push(newMessage);

        // Update the thread in the database
        await db.query('UPDATE channels SET threads = ? WHERE channel_key = ?', [
            JSON.stringify(threads),
            channel_key
        ]);

        res.status(200).json({ message: 'File uploaded successfully', thread: newMessage });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
