/*
  Warnings:

  - Added the required column `course` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "course" TEXT NOT NULL,
ADD COLUMN     "expiresByGraduateAt" INTEGER;

-- CreateIndex
CREATE INDEX "user_course_idx" ON "user"("course");

-- CreateIndex
CREATE INDEX "user_expiresByGraduateAt_idx" ON "user"("expiresByGraduateAt");
