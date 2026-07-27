/*
  Warnings:

  - Added the required column `user_role` to the `Trainer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Trainer" ADD COLUMN     "user_role" TEXT NOT NULL;
