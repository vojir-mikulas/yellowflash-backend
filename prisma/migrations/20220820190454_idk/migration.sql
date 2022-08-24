/*
  Warnings:

  - Added the required column `price` to the `shippingMethod` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `shippingmethod` ADD COLUMN `price` INTEGER NOT NULL;
