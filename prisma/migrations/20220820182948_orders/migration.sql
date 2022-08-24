/*
  Warnings:

  - Added the required column `email` to the `order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `order` ADD COLUMN `email` VARCHAR(191) NOT NULL;
