/*
  Warnings:

  - The values [ACEPTED] on the enum `BookingStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `basePrice` on the `ServiceTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `maxPrice` on the `ServiceTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `minPrice` on the `ServiceTemplate` table. All the data in the column will be lost.
  - Added the required column `price` to the `ServiceTemplate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BookingStatus_new" AS ENUM ('PENDING', 'CONFIRMED', 'STARTED', 'COMPLETED', 'CANCELED', 'ACCEPTED', 'REJECTED');
ALTER TABLE "public"."Booking" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Booking" ALTER COLUMN "status" TYPE "BookingStatus_new" USING ("status"::text::"BookingStatus_new");
ALTER TYPE "BookingStatus" RENAME TO "BookingStatus_old";
ALTER TYPE "BookingStatus_new" RENAME TO "BookingStatus";
DROP TYPE "public"."BookingStatus_old";
ALTER TABLE "Booking" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "cancelReason" TIMESTAMP(3),
ADD COLUMN     "canceledAt" TIMESTAMP(3),
ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "startedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "ServiceTemplate" DROP COLUMN "basePrice",
DROP COLUMN "maxPrice",
DROP COLUMN "minPrice",
ADD COLUMN     "price" INTEGER NOT NULL;
