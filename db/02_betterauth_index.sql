-- =========================================================
-- 1. 既存テーブルへの不足カラム・インデックスの追加 (ALTER)
-- =========================================================
-- userテーブル: displayUsernameカラムの追加とインデックスの追加
ALTER TABLE `user`
ADD COLUMN `displayUsername` VARCHAR(255) DEFAULT NULL;
CREATE INDEX `user_course_idx` ON `user` (`course`);
CREATE INDEX `user_expiresByGraduateAt_idx` ON `user` (`expiresByGraduateAt`);
-- sessionテーブル: impersonatedByカラムの追加
ALTER TABLE `session`
ADD COLUMN `impersonatedBy` VARCHAR(255) DEFAULT NULL;
-- passkeyテーブル: aaguidカラムの追加とインデックスの追加
ALTER TABLE `passkey`
ADD COLUMN `aaguid` VARCHAR(255) DEFAULT NULL;
CREATE INDEX `passkey_credentialID_idx` ON `passkey` (`credentialID`);
-- verificationテーブル: identifierの型変更(インデックスを張るため)とインデックス追加
ALTER TABLE `verification`
MODIFY `identifier` VARCHAR(255) NOT NULL;
CREATE INDEX `verification_identifier_idx` ON `verification` (`identifier`);