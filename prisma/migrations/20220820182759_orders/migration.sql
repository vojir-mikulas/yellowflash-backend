/*
  Warnings:

  - You are about to drop the column `Address` on the `order` table. All the data in the column will be lost.
  - Added the required column `address` to the `order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `order` DROP COLUMN `Address`,
    ADD COLUMN `address` VARCHAR(191) NOT NULL;
