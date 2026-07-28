/*
  Warnings:

  - You are about to drop the column `uploaded_by` on the `video` table. All the data in the column will be lost.
  - Added the required column `course_id` to the `video` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `video` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "video" DROP COLUMN "uploaded_by",
ADD COLUMN     "course_id" INTEGER NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "duration" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "video" ADD CONSTRAINT "video_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
