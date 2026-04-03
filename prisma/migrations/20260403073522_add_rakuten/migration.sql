/*
  Warnings:

  - A unique constraint covering the columns `[sticker_id]` on the table `book` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "book" ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "rakutenLinked" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "book_sticker_id_key" ON "book"("sticker_id");
