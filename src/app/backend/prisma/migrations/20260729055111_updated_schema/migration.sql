/*
  Warnings:

  - A unique constraint covering the columns `[user_id,course_id]` on the table `enrollment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `screenshot_id` to the `enrollment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "enrollment" DROP CONSTRAINT "enrollment_certificate_id_fkey";

-- AlterTable
ALTER TABLE "enrollment" ADD COLUMN     "screenshot_id" INTEGER NOT NULL,
ALTER COLUMN "progress" SET DEFAULT 0.0,
ALTER COLUMN "completed" SET DEFAULT false,
ALTER COLUMN "certificate_id" DROP NOT NULL;

-- CreateTable
CREATE TABLE "screenshot" (
    "id" SERIAL NOT NULL,
    "file_path" TEXT NOT NULL,

    CONSTRAINT "screenshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "screenshot_file_path_key" ON "screenshot"("file_path");

-- CreateIndex
CREATE UNIQUE INDEX "enrollment_user_id_course_id_key" ON "enrollment"("user_id", "course_id");

-- AddForeignKey
ALTER TABLE "enrollment" ADD CONSTRAINT "enrollment_certificate_id_fkey" FOREIGN KEY ("certificate_id") REFERENCES "certificate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollment" ADD CONSTRAINT "enrollment_screenshot_id_fkey" FOREIGN KEY ("screenshot_id") REFERENCES "screenshot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
