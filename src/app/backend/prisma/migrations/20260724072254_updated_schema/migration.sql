/*
  Warnings:

  - You are about to drop the column `audio_fileId` on the `Song` table. All the data in the column will be lost.
  - You are about to drop the column `certificate_id` on the `course` table. All the data in the column will be lost.
  - You are about to drop the column `is_published` on the `course` table. All the data in the column will be lost.
  - You are about to drop the column `level` on the `course` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[url]` on the table `audio_file` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `audio_file_id` to the `Song` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `audio_file` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Song" DROP CONSTRAINT "Song_audio_fileId_fkey";

-- AlterTable
ALTER TABLE "Song" DROP COLUMN "audio_fileId",
ADD COLUMN     "audio_file_id" INTEGER NOT NULL,
ADD COLUMN     "price" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "audio_file" ADD COLUMN     "url" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "course" DROP COLUMN "certificate_id",
DROP COLUMN "is_published",
DROP COLUMN "level";

-- CreateIndex
CREATE UNIQUE INDEX "audio_file_url_key" ON "audio_file"("url");

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_audio_file_id_fkey" FOREIGN KEY ("audio_file_id") REFERENCES "audio_file"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
