/*
  Warnings:

  - Made the column `userId` on table `Song` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Song" DROP CONSTRAINT "Song_userId_fkey";

-- DropForeignKey
ALTER TABLE "course_review" DROP CONSTRAINT "course_review_trainer_id_fkey";

-- AlterTable
ALTER TABLE "Song" ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "course_review" ALTER COLUMN "trainer_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_review" ADD CONSTRAINT "course_review_trainer_id_fkey" FOREIGN KEY ("trainer_id") REFERENCES "Trainer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
