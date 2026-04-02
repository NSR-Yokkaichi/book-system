/*
  Warnings:

  - You are about to drop the column `studentId` on the `rental` table. All the data in the column will be lost.
  - You are about to drop the `student` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `rental` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "rental" DROP CONSTRAINT "rental_studentId_fkey";

-- DropForeignKey
ALTER TABLE "student" DROP CONSTRAINT "student_userId_fkey";

-- DropIndex
DROP INDEX "rental_studentId_idx";

-- AlterTable
ALTER TABLE "rental" DROP COLUMN "studentId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- DropTable
DROP TABLE "student";

-- CreateIndex
CREATE INDEX "rental_userId_idx" ON "rental"("userId");

-- AddForeignKey
ALTER TABLE "rental" ADD CONSTRAINT "rental_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
