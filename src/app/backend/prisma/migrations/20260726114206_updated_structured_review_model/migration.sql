/*
  Warnings:

  - You are about to drop the column `Pitch` on the `structured_review` table. All the data in the column will be lost.
  - You are about to drop the column `Voice` on the `structured_review` table. All the data in the column will be lost.
  - Added the required column `pitch` to the `structured_review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `voice` to the `structured_review` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "structured_review" DROP COLUMN "Pitch",
DROP COLUMN "Voice",
ADD COLUMN     "pitch" TEXT NOT NULL,
ADD COLUMN     "voice" TEXT NOT NULL;
