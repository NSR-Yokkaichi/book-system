ALTER TABLE `rental`
ADD `returnedAt` DATETIME NULL DEFAULT NULL
AFTER `expiresAt`;
ALTER ALGORITHM = UNDEFINED DEFINER = `root` @`%` SQL SECURITY DEFINER VIEW `v_rental_book_full` AS
SELECT `r`.`id` AS `rental_id`,
  `r`.`userId` AS `userId`,
  `r`.`bookId` AS `bookId`,
  `r`.`expiresAt` AS `expiresAt`,
  `r`.`returnedAt` AS `returnedAt`,
  `r`.`createdAt` AS `rental_createdAt`,
  `r`.`updatedAt` AS `rental_updated_at`,
  `b`.`name` AS `book_name`,
  `b`.`stickerId` AS `stickerId`,
  `b`.`isbn` AS `isbn`,
  `b`.`jan` AS `jan`,
  `b`.`author` AS `author`,
  `b`.`publisher` AS `publisher`,
  `b`.`publishedAt` AS `publishedAt`,
  `b`.`rakutenLinked` AS `rakutenLinked`,
  `b`.`imageUrl` AS `imageUrl`,
  `b`.`createdAt` AS `book_createdAt`,
  `b`.`updatedAt` AS `book_updatedAt`
FROM (
    `book_system`.`rental` `r`
    LEFT JOIN `book_system`.`book` `b` ON (`r`.`bookId` = `b`.`id`)
  )