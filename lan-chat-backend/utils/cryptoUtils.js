const crypto = require('crypto');

// Encryption configuration
const SECRET_KEY = crypto.createHash('sha256').update(process.env.CHANNEL_SECRET).digest();

// Encrypt a list of user IDs (e.g., [1, 10]) into a channel key
exports.encryptChannelKey = (userIds) => {
    const sortedIds = userIds.sort((a, b) => a - b); // Ensure consistent order
    const data = sortedIds.join('-'); // Join user IDs as a string (e.g., "1-4")

    // Create a cipher without using a random IV (deterministic encryption)
    const cipher = crypto.createCipheriv('aes-256-ecb', SECRET_KEY, null);
    const encrypted = Buffer.concat([cipher.update(data, 'utf8'), cipher.final()]);
    return encrypted.toString('hex'); // Return as hex string
};

// Decrypt a channel key back into the user IDs
exports.decryptChannelKey = (encryptedKey) => {
    const decipher = crypto.createDecipheriv('aes-256-ecb', SECRET_KEY, null);
    const decrypted = Buffer.concat([
        decipher.update(Buffer.from(encryptedKey, 'hex')),
        decipher.final(),
    ]);

    // Convert back to array of integers
    return decrypted.toString('utf8').split('-').map(Number);
};
