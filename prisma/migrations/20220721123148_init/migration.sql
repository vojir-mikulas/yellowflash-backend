/*
  Warnings:

  - The primary key for the `categoriesonitems` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `category` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `name` on the `category` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `categoriesonitems` DROP FOREIGN KEY `categoriesonitems_categoryId_fkey`;

-- AlterTable
ALTER TABLE `categoriesonitems` DROP PRIMARY KEY,
    MODIFY `categoryId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`itemId`, `categoryId`);

-- AlterTable
ALTER TABLE `category` DROP PRIMARY KEY,
    DROP COLUMN `name`,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `categoriesonitems` ADD CONSTRAINT `categoriesonitems_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
