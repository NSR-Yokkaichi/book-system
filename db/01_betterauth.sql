-- 1. ユーザーテーブル (user)
CREATE TABLE `user` (
  `id` VARCHAR(255) NOT NULL PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `emailVerified` BOOLEAN NOT NULL,
  `image` TEXT,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Username プラグイン
  `username` VARCHAR(255) UNIQUE,
  
  -- Admin プラグイン
  `role` VARCHAR(255),
  `banned` BOOLEAN,
  `banReason` TEXT,
  `banExpires` TIMESTAMP NULL DEFAULT NULL,
  
  -- カスタムフィールド
  `course` VARCHAR(255),
  `expiresByGraduateAt` BIGINT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 2. セッションテーブル (session)
CREATE TABLE `session` (
  `id` VARCHAR(255) NOT NULL PRIMARY KEY,
  `userId` VARCHAR(255) NOT NULL,
  `token` VARCHAR(255) NOT NULL UNIQUE,
  `expiresAt` TIMESTAMP NOT NULL,
  `ipAddress` VARCHAR(255),
  `userAgent` TEXT,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 3. アカウントテーブル (account)
CREATE TABLE `account` (
  `id` VARCHAR(255) NOT NULL PRIMARY KEY,
  `userId` VARCHAR(255) NOT NULL,
  `accountId` VARCHAR(255) NOT NULL,
  `providerId` VARCHAR(255) NOT NULL,
  `accessToken` TEXT,
  `refreshToken` TEXT,
  `idToken` TEXT,
  `accessTokenExpiresAt` TIMESTAMP NULL DEFAULT NULL,
  `refreshTokenExpiresAt` TIMESTAMP NULL DEFAULT NULL,
  `scope` TEXT,
  `password` TEXT,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 4. 検証テーブル (verification)
CREATE TABLE `verification` (
  `id` VARCHAR(255) NOT NULL PRIMARY KEY,
  `identifier` TEXT NOT NULL,
  `value` TEXT NOT NULL,
  `expiresAt` TIMESTAMP NOT NULL,
  `createdAt` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 5. パスキーテーブル (passkey)
CREATE TABLE `passkey` (
  `id` VARCHAR(255) NOT NULL PRIMARY KEY,
  `name` VARCHAR(255),
  `publicKey` TEXT NOT NULL,
  `userId` VARCHAR(255) NOT NULL,
  `credentialID` VARCHAR(255) NOT NULL,
  `counter` INTEGER NOT NULL,
  `deviceType` VARCHAR(255) NOT NULL,
  `backedUp` BOOLEAN NOT NULL,
  `transports` VARCHAR(255),
  `createdAt` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- インデックスの作成
CREATE INDEX `session_userId_idx` ON `session`(`userId`);
CREATE INDEX `account_userId_idx` ON `account`(`userId`);
CREATE INDEX `passkey_userId_idx` ON `passkey`(`userId`);