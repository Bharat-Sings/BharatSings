/*
  Warnings:

  - A unique constraint covering the columns `[file_path]` on the table `video` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "video_file_path_key" ON "video"("file_path");
