CREATE TABLE `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `displayName` VARCHAR(255),
    `bio` TEXT,
    `interests` JSON,
    `photos` JSON,
    `gender` VARCHAR(50),
    `birthDate` DATE,
    `location` VARCHAR(255),
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `chats` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `chat_participants` (
    `chatId` INT,
    `userId` INT,
    PRIMARY KEY (`chatId`, `userId`),
    FOREIGN KEY (`chatId`) REFERENCES `chats`(`id`),
    FOREIGN KEY (`userId`) REFERENCES `users`(`id`)
);

CREATE TABLE `messages` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `chatId` INT,
    `senderId` INT,
    `content` TEXT,
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`chatId`) REFERENCES `chats`(`id`),
    FOREIGN KEY (`senderId`) REFERENCES `users`(`id`)
);

CREATE TABLE `matches` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user1_id` INT, -- Тот, кто лайкнул
    `user2_id` INT, -- Тот, кого лайкнули
    `status` ENUM('liked', 'superliked', 'matched'),
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user1_id`) REFERENCES `users`(`id`),
    FOREIGN KEY (`user2_id`) REFERENCES `users`(`id`),
    UNIQUE KEY `unique_match` (`user1_id`,`user2_id`)
);

CREATE TABLE `groups` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT,
    `category` VARCHAR(255),
    `coverImage` VARCHAR(255),
    `createdBy` INT,
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`)
);
