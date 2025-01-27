# lan-chat
A quick project to create a LAN based chat app

# Environment Caveats
1. Used MacOS
2. User node v22.12.0.
3. Used Brew installed MySQL. You can use LAMP/MAMP stack as long as you know your MySQL's host, username and password.
4. Certain UI Limitations.
5. Used loop call instead of websocket to avoid complications in deploying the entire app/

# Reminder
Have fun!

# MYSQL for table creation
~~~~sql
USE lan_chat_app;

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
    channel_key VARCHAR(255) NOT NULL,
    threads LONGTEXT,
    participants LONGTEXT NOT NULL,
    page INT DEFAULT 1,
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
DBHOST=127.0.0.1
DBNAME=lan_chat_app
DBUNAME=root
DBPASS=yourpassword
CHANNEL_SECRET=your_channels_secret_key
```
5. Run `node server.js`. See example initial prompt and copy the url after "Server is accessible on your network"
```
Server is running on http://localhost:5000
Server is accessible on your network at http://192.168.254.156:5000
```

# Running lan-chat-frontend via npm
1. Open Terminal
2. Do `cd lan-chat-frontend`.
3. Run `npm install`
4. Create `.env` file (inside the lan-chat-backend directory). See example .env file details below
```
REACT_APP_BACKEND_URL=http://192.168.254.156:5000
```
5. Run `npm start`
Reminder: Fire up first your backend before serving the frontend
