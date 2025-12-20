/*
  Warnings:

  - You are about to drop the column `bookingCode` on the `Booking` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Booking_bookingCode_key";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "bookingCode";
