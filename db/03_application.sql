-- =========================================================
-- 2. 新規テーブルの作成 (CREATE)
-- =========================================================
-- 図書テーブル (book)
CREATE TABLE `book` (
  `id` CHAR(26) NOT NULL PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `sticker_id` VARCHAR(255) UNIQUE,
  `isbn` VARCHAR(255) NOT NULL,
  `author` VARCHAR(255),
  `publisher` VARCHAR(255),
  `rakutenLinked` BOOLEAN NOT NULL DEFAULT FALSE,
  `imageUrl` TEXT,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
CREATE INDEX `book_isbn_idx` ON `book`(`isbn`);
-- 貸出テーブル (rental)
CREATE TABLE `rental` (
  `id` CHAR(26) NOT NULL PRIMARY KEY,
  `userId` VARCHAR(255) NOT NULL,
  `bookId` CHAR(26) NOT NULL,
  `expiresAt` TIMESTAMP NOT NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`bookId`) REFERENCES `book`(`id`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
CREATE INDEX `rental_userId_idx` ON `rental`(`userId`);
CREATE INDEX `rental_bookId_idx` ON `rental`(`bookId`);
-- キャンパステーブル (campus)
CREATE TABLE `campus` (
  `id` CHAR(26) NOT NULL PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `rentalDeadline` INT NOT NULL DEFAULT 14,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- プッシュ通知サブスクリプションテーブル (push_subscription)
CREATE TABLE `push_subscription` (
  `id` CHAR(26) NOT NULL PRIMARY KEY,
  `userId` VARCHAR(255) NOT NULL,
  `endpoint` VARCHAR(512) NOT NULL UNIQUE,
  `p256dh` VARCHAR(255) NOT NULL,
  `auth` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
CREATE INDEX `push_subscription_userId_idx` ON `push_subscription`(`userId`);