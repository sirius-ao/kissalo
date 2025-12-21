/*
  Warnings:

  - Added the required column `waaletId` to the `ConcliationPayment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ConcliationPayment" ADD COLUMN     "fileUrl" TEXT,
ADD COLUMN     "waaletId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "ConcliationPayment" ADD CONSTRAINT "ConcliationPayment_waaletId_fkey" FOREIGN KEY ("waaletId") REFERENCES "Wallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
