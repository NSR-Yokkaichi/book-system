-- ISBNコードのみならず書籍JANコードにも対応させる
-- また、出版年も収集する
-- INDEXを追加する
ALTER TABLE `book` CHANGE `isbn` `isbn` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL;
ALTER TABLE `book`
ADD `publishedAt` DATE NULL DEFAULT NULL
AFTER `publisher`;
ALTER TABLE `book`
ADD INDEX `author_idx` (`author`);
ALTER TABLE `book`
ADD INDEX `publisher_idx` (`publisher`);
ALTER TABLE `book`
ADD INDEX `publishedAt` (`publishedAt`);
ALTER TABLE `book`
ADD `jan` VARCHAR(255) NULL DEFAULT NULL
AFTER `isbn`,
  ADD INDEX `jan_idx` (`jan`);