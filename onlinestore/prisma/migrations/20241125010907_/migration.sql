/*
  Warnings:

  - You are about to drop the column `model` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `serialNo` on the `ProductItem` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "ProductItem_serialNo_key";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "model",
ALTER COLUMN "brand" DROP NOT NULL,
ALTER COLUMN "category" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ProductItem" DROP COLUMN "serialNo";
