-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "BookingStatus" ADD VALUE 'ACEPTED';
ALTER TYPE "BookingStatus" ADD VALUE 'REJECTED';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "amountAvaliable" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "BookingSteps_bookingId_idx" ON "BookingSteps"("bookingId");

-- CreateIndex
CREATE INDEX "BookingSteps_senderId_idx" ON "BookingSteps"("senderId");
