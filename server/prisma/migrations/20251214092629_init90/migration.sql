/*
  Warnings:

  - A unique constraint covering the columns `[tokenToActivate]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[token]` on the table `Verifications` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tokenToActivate` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "tokenToActivate" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_tokenToActivate_key" ON "User"("tokenToActivate");

-- CreateIndex
CREATE UNIQUE INDEX "Verifications_token_key" ON "Verifications"("token");
