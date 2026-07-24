/*
  Warnings:

  - You are about to drop the column `review_type` on the `song_review` table. All the data in the column will be lost.
  - Added the required column `category` to the `Trainer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Song" ALTER COLUMN "release_date" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Trainer" ADD COLUMN     "category" TEXT NOT NULL,
ALTER COLUMN "is_active" SET DEFAULT true;

-- AlterTable
ALTER TABLE "song_review" DROP COLUMN "review_type";
