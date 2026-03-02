/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `student` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "student_userId_key" ON "student"("userId");
