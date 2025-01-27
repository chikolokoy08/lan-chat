const db = require('../models/db');
const { encryptChannelKey, decryptChannelKey } = require('../utils/cryptoUtils');

// Create or get a channel
exports.createOrGetChannel = async (req, res) => {
    const { user_ids } = req.body;

    // Validate the input
    if (!Array.isArray(user_ids)) {
        return res.status(400).json({ message: 'Invalid user_ids. Must contain more that 2 user IDs.' });
    }

    try {
        // Sort user IDs to ensure consistency (e.g., [1, 10])
        const sortedUserIds = user_ids.sort((a, b) => a - b);

        const placeholders = sortedUserIds.map(() => '?').join(',');
        const [users] = await db.query(
            `SELECT id FROM users WHERE id IN (${placeholders})`,
            sortedUserIds
        );

        if (users.length !== sortedUserIds.length) {
            return res.status(404).json({ message: 'One or more users do not exist.' });
        }

        // Generate the channel key
        const channelKey = encryptChannelKey(sortedUserIds);

        // Check if a channel with this key already exists
        const [existingChannel] = await db.query('SELECT * FROM channels WHERE channel_key = ?',[channelKey]);
        if (existingChannel.length > 0) {
            // If the channel exists, return it
            return res.status(200).json({
                message: 'Channel already exists',
                channel: existingChannel[0]
            });
        }

        // Create a new channel
        const participants = JSON.stringify(sortedUserIds);
        const [result] = await db.query('INSERT INTO channels (channel_key, participants) VALUES (?, ?)',[channelKey, participants]);
        // Return the newly created channel
        res.status(201).json({
            message: 'Channel created successfully',
            channel: {
                id: result.insertId,
                channel_key: channelKey,
                participants: sortedUserIds
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Save a message to the channel
exports.saveMessage = async (req, res) => {
    
    const { channel_key, message } = req.body;

    // Validate input
    if (!channel_key) {
        return res.status(400).json({ message: 'Invalid input. Provide channel_key, user_ids, and message.' });
    }

    try {
        // Decrypt the channel_key to verify the user_ids
        const decryptedUserIds = decryptChannelKey(channel_key);
        const sortedUserIds = decryptedUserIds;
        const sender_id = req.user.id;

        if (!sortedUserIds.includes(sender_id)) {
            return res.status(400).json({ message: 'Invalid channel_key or user_ids mismatch.' });
        }

        // Check if the channel exists
        const [channelRows] = await db.query(`SELECT * FROM channels WHERE channel_key = ? ORDER BY page DESC LIMIT 1`, [channel_key]);
        if (channelRows.length === 0) {
            return res.status(404).json({ message: 'Channel does not exist.' });
        }

        const channel = channelRows[0];
        const currentPage = channel.page; 
        const participants = JSON.stringify(channel.participants);
        console.log(`Current Page: ${currentPage}`);
       
        // Parse the existing thread (if null, initialize as an empty array)
        const existingThread = channel.threads ? JSON.parse(channel.threads) : [];
        console.log(`Thread:`);
        console.log(existingThread);

        // Append the new message to the thread
        const newMessage = {
            sender_id: sender_id, // The sender ID could be passed explicitly if needed
            content: message,
            timestamp: new Date().toISOString()
        };
        existingThread.push(newMessage);
        console.log(existingThread);
        const maxSize = 4 * 1024 * 1024 * 1024; // LONGTEXT theoretical max size
        const threadSize = Buffer.byteLength(JSON.stringify(existingThread), 'utf8');

        if (threadSize >= maxSize) {
            // If max size reached, create a new page
            const newPage = currentPage + 1;

            // Insert a new row for the new page
            await db.query(
                'INSERT INTO channels (channel_key, page, threads, participants) VALUES (?, ?, ?, ?)',
                [channel_key, newPage, JSON.stringify(existingThread), participants]
            );

            res.status(201).json({
                message: 'Message saved successfully on a new page',
                lastMessage: newMessage,
                page: newPage
            });
        } else {
            console.log(JSON.stringify(existingThread));
            await db.query(
                'UPDATE channels SET threads = ? WHERE channel_key = ? AND page = ?',
                [JSON.stringify(existingThread), channel_key, currentPage]
            );

            res.status(200).json({
                message: 'Message saved successfully',
                lastMessage: newMessage,
                page: currentPage
            });
        }

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getMessage = async (req, res) => {
    
    const { channel_key } = req.body;

    // Validate input
    if (!channel_key) {
        return res.status(400).json({ message: 'Invalid input. Provide channel_key, user_ids, and message.' });
    }

    try {
        // Decrypt the channel_key to verify the user_ids
        const decryptedUserIds = decryptChannelKey(channel_key);
        const sortedUserIds = decryptedUserIds;
        const checker_id = req.user.id;
        if (!sortedUserIds.includes(checker_id)) {
            return res.status(400).json({ message: 'Invalid channel_key or user_ids mismatch.' });
        }

        // Check if the channel exists
        const [channelRows] = await db.query(`SELECT * FROM channels WHERE channel_key = ? ORDER BY page DESC LIMIT 1`, [channel_key]);
        if (channelRows.length === 0) {
            return res.status(404).json({ message: 'Channel does not exist.' });
        }

        const channel = channelRows[0];
        const currentPage = channel.page; 

        // Parse the existing thread (if null, initialize as an empty array)
        const existingThread = channel.threads ? JSON.parse(channel.threads) : [];

        res.status(200).json({
            message: 'Message thread is here',
            thread: existingThread,
            page: currentPage
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
