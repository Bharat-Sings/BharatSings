-- DropForeignKey
ALTER TABLE "album" DROP CONSTRAINT "album_genre_id_fkey";

-- DropForeignKey
ALTER TABLE "like" DROP CONSTRAINT "like_comment_id_fkey";

-- DropForeignKey
ALTER TABLE "like" DROP CONSTRAINT "like_song_id_fkey";

-- AlterTable
ALTER TABLE "album" ALTER COLUMN "release_date" DROP NOT NULL,
ALTER COLUMN "cover_image" DROP NOT NULL,
ALTER COLUMN "genre_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "like" ALTER COLUMN "song_id" DROP NOT NULL,
ALTER COLUMN "comment_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "album" ADD CONSTRAINT "album_genre_id_fkey" FOREIGN KEY ("genre_id") REFERENCES "genre"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "like" ADD CONSTRAINT "like_song_id_fkey" FOREIGN KEY ("song_id") REFERENCES "Song"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "like" ADD CONSTRAINT "like_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
