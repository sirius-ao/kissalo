/*
  Warnings:

  - You are about to drop the column `optCode` on the `Verifications` table. All the data in the column will be lost.
  - Made the column `token` on table `Verifications` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Verifications" DROP COLUMN "optCode",
ALTER COLUMN "token" SET NOT NULL;
