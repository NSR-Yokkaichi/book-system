CREATE VIEW v_rental_book_full AS
SELECT -- rentalテーブルの全カラム
  r.id AS rental_id,
  r.userId,
  r.bookId,
  r.expiresAt,
  r.createdAt AS rental_createdAt,
  r.updatedAt AS rental_updated_at,
  -- bookテーブルの全カラム
  b.name AS book_name,
  b.stickerId,
  b.isbn,
  b.jan,
  b.author,
  b.publisher,
  b.publishedAt,
  b.rakutenLinked,
  b.imageUrl,
  b.createdAt AS book_createdAt,
  b.updatedAt AS book_updatedAt
FROM `rental` AS r
  LEFT JOIN `book` AS b ON r.bookId = b.id;