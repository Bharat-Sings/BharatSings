/*
  Warnings:

  - A unique constraint covering the columns `[songId,userId]` on the table `structured_review` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `melody` on the `structured_review` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `rhythm` on the `structured_review` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `pitch` on the `structured_review` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `voice` on the `structured_review` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "structured_review" DROP COLUMN "melody",
ADD COLUMN     "melody" INTEGER NOT NULL,
DROP COLUMN "rhythm",
ADD COLUMN     "rhythm" INTEGER NOT NULL,
DROP COLUMN "pitch",
ADD COLUMN     "pitch" INTEGER NOT NULL,
DROP COLUMN "voice",
ADD COLUMN     "voice" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "structured_review_songId_userId_key" ON "structured_review"("songId", "userId");
