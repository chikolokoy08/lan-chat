# lan-chat
A quick project to create a LAN based chat app

# MYSQL for table creation
~~~~sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    status ENUM('online', 'offline') DEFAULT 'offline',
    avatar VARCHAR(255) DEFAULT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE channels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    channel_key VARCHAR(255) UNIQUE NOT NULL,
    threads LONGTEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE uploads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    filename VARCHAR(255),
    url VARCHAR(255),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
~~~~

# Running lan-chat-backend via node.js
1. Open Terminal
2. Do `cd lan-chat-backend`.
3. Run `npm install`
4. Create `.env` file (inside the lan-chat-backend directory). See example .env file details below
```
PORT=5000
JWT_SECRET=lan_chat_app_private_key
DBHOST=127.0.01
DBNAME=lan_chat_app
DBUNAME=root
DBPASS=yourpassword
```
5. Run `node server.js`
