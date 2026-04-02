-- AlterTable
ALTER TABLE "user" ADD COLUMN     "course" TEXT,
ADD COLUMN     "expiresByGraduateAt" INTEGER;

-- CreateIndex
CREATE INDEX "user_course_idx" ON "user"("course");

-- CreateIndex
CREATE INDEX "user_expiresByGraduateAt_idx" ON "user"("expiresByGraduateAt");
