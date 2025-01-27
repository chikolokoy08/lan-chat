const db = require('../models/db');

// Get User Profile
exports.getProfile = async (req, res) => {
    const userId = req.user.id;
    try {
        const [rows] = await db.query('SELECT id, email, first_name, last_name, avatar, status FROM users WHERE id = ?', [userId]);
        if (rows.length === 0) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllUsers = async (req, res) => {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1; // Default page is 1
    const limit = parseInt(req.query.limit) || 10; // Default limit is 10
    const offset = (page - 1) * limit;

    try {
        // Query to fetch users with pagination
        const [rows] = await db.query(
            'SELECT id, email, first_name, last_name, avatar, status, timestamp FROM users WHERE id != ? LIMIT ? OFFSET ?',
            [userId, limit, offset]
        );

        // Get total number of users
        const [countRows] = await db.query('SELECT COUNT(*) as count FROM users');
        const totalUsers = countRows[0].count;

        res.status(200).json({
            users: rows,
            pagination: {
                totalUsers,
                currentPage: page,
                totalPages: Math.ceil(totalUsers / limit)
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
