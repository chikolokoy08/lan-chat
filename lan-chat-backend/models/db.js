const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.DBHOST ? process.env.DBHOST : '127.0.0.1',
    user: process.env.DBUNAME ? process.env.DBUNAME : 'root',
    password: process.env.DBPASS ? process.env.DBPASS : 'yourpasword',
    database: process.env.DBNAME ? process.env.DBNAME : 'dbname',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool.promise();
