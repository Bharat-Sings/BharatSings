/*
  Warnings:

  - Added the required column `paytm_phone_number` to the `course` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "course" ADD COLUMN     "paytm_phone_number" TEXT NOT NULL;
