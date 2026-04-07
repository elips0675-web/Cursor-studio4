CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    firebase_uid VARCHAR(255) UNIQUE,
    displayName VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    age INT,
    city VARCHAR(255),
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chats (
    id INT PRIMARY KEY AUTO_INCREMENT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chat_members (
    chat_id INT,
    user_id INT,
    FOREIGN KEY (chat_id) REFERENCES chats(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    PRIMARY KEY (chat_id, user_id)
);

CREATE TABLE messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    chat_id INT,
    sender_id INT,
    text TEXT,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chat_id) REFERENCES chats(id),
    FOREIGN KEY (sender_id) REFERENCES users(id)
);