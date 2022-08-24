/*
  Warnings:

  - You are about to drop the column `deliveryMethod` on the `order` table. All the data in the column will be lost.
  - Added the required column `shippingMethod` to the `order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `order` DROP COLUMN `deliveryMethod`,
    ADD COLUMN `shippingMethod` VARCHAR(191) NOT NULL;
