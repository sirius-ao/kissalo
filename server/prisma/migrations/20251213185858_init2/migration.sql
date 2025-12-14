/*
  Warnings:

  - You are about to drop the `RecoveryAccountRequest` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "VerificationsType" AS ENUM ('ACCOUNT', 'RESET_PASS_REQUEST');

-- DropForeignKey
ALTER TABLE "RecoveryAccountRequest" DROP CONSTRAINT "RecoveryAccountRequest_userId_fkey";

-- DropTable
DROP TABLE "RecoveryAccountRequest";

-- CreateTable
CREATE TABLE "Verifications" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "token" TEXT,
    "optCode" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "VerificationsType" NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "metaData" JSONB,

    CONSTRAINT "Verifications_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Verifications" ADD CONSTRAINT "Verifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
