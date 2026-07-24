/*
  Warnings:

  - You are about to drop the column `album_id` on the `Song` table. All the data in the column will be lost.
  - You are about to drop the column `audio_file_id` on the `Song` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `Song` table. All the data in the column will be lost.
  - You are about to drop the column `is_marketplace_item` on the `Song` table. All the data in the column will be lost.
  - You are about to drop the column `is_published` on the `Song` table. All the data in the column will be lost.
  - You are about to drop the column `lyrics_id` on the `Song` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Song` table. All the data in the column will be lost.
  - You are about to drop the column `uploader_id` on the `Song` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Song" DROP CONSTRAINT "Song_album_id_fkey";

-- DropForeignKey
ALTER TABLE "Song" DROP CONSTRAINT "Song_audio_file_id_fkey";

-- DropForeignKey
ALTER TABLE "Song" DROP CONSTRAINT "Song_lyrics_id_fkey";

-- DropForeignKey
ALTER TABLE "Song" DROP CONSTRAINT "Song_uploader_id_fkey";

-- AlterTable
ALTER TABLE "Song" DROP COLUMN "album_id",
DROP COLUMN "audio_file_id",
DROP COLUMN "duration",
DROP COLUMN "is_marketplace_item",
DROP COLUMN "is_published",
DROP COLUMN "lyrics_id",
DROP COLUMN "price",
DROP COLUMN "uploader_id",
ADD COLUMN     "albumId" INTEGER,
ADD COLUMN     "audio_fileId" INTEGER,
ADD COLUMN     "lyricsId" INTEGER,
ADD COLUMN     "userId" INTEGER;

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_audio_fileId_fkey" FOREIGN KEY ("audio_fileId") REFERENCES "audio_file"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "album"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_lyricsId_fkey" FOREIGN KEY ("lyricsId") REFERENCES "lyrics"("id") ON DELETE SET NULL ON UPDATE CASCADE;
