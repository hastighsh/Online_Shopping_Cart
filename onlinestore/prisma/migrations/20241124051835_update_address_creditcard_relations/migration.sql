/*
  Warnings:

  - Made the column `username` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "creditCardId" INTEGER,
ADD COLUMN     "shippingAddressId" INTEGER,
ALTER COLUMN "username" SET NOT NULL;

-- CreateTable
CREATE TABLE "Address" (
    "id" SERIAL NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreditCardInfo" (
    "id" SERIAL NOT NULL,
    "cardHolder" TEXT NOT NULL,
    "cardLast4" TEXT NOT NULL,
    "cardType" TEXT NOT NULL,
    "expiration" TIMESTAMP(3) NOT NULL,
    "billingAddressId" INTEGER NOT NULL,

    CONSTRAINT "CreditCardInfo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_shippingAddressId_fkey" FOREIGN KEY ("shippingAddressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_creditCardId_fkey" FOREIGN KEY ("creditCardId") REFERENCES "CreditCardInfo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditCardInfo" ADD CONSTRAINT "CreditCardInfo_billingAddressId_fkey" FOREIGN KEY ("billingAddressId") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
