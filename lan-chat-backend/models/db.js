const mysql = require('mysql2');
require('dotenv').config();

if (process.env.DBHOST == undefined || process.env.DBUNAME == undefined || process.env.DBPASS == undefined || process.env.DBNAME == undefined) {
    console.log(`It's either you don't have .env file or you have a problem with your database details on your .env file.`);
    return false;
}

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
