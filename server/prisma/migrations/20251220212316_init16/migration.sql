/*
  Warnings:

  - You are about to drop the column `clientNotes` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `professionalNotes` on the `Booking` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "clientNotes",
DROP COLUMN "professionalNotes";

-- CreateTable
CREATE TABLE "BookingSteps" (
    "id" SERIAL NOT NULL,
    "bookingId" INTEGER NOT NULL,
    "senderId" INTEGER NOT NULL,
    "notes" TEXT NOT NULL,
    "files" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BookingSteps_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BookingSteps" ADD CONSTRAINT "BookingSteps_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingSteps" ADD CONSTRAINT "BookingSteps_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
