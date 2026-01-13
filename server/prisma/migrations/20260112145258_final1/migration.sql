/*
  Warnings:

  - You are about to drop the column `waaletId` on the `ConcliationPayment` table. All the data in the column will be lost.
  - You are about to drop the `Wallet` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ConcliationPayment" DROP CONSTRAINT "ConcliationPayment_waaletId_fkey";

-- DropForeignKey
ALTER TABLE "Wallet" DROP CONSTRAINT "Wallet_professionalId_fkey";

-- AlterTable
ALTER TABLE "ConcliationPayment" DROP COLUMN "waaletId";

-- DropTable
DROP TABLE "Wallet";
