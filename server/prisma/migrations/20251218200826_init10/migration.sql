/*
  Warnings:

  - The values [MIDIUM] on the enum `BookingPriority` will be removed. If these variants are still used in the database, this will fail.
  - The values [SYTEM] on the enum `NotificationType` will be removed. If these variants are still used in the database, this will fail.
  - The values [PROFISIONAL_HOME,PROFISIONAL_SPACE] on the enum `ServiceLocation` will be removed. If these variants are still used in the database, this will fail.
  - The values [PROFISIONAL,COSTUMER] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `adress` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `cancellationReaseon` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `profissionalId` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `profissionalNodes` on the `Booking` table. All the data in the column will be lost.
  - The `status` column on the `Booking` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `coverUrl` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `featured` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `stats` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `bookingId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `paymentId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `reviewId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `subject` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `isFeatured` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `isRead` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `profisionalReply` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `profissionalId` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `serviceId` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `isVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `profile` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `tokenToActivate` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `acountHolder` on the `Wallet` table. All the data in the column will be lost.
  - You are about to drop the column `acountNumber` on the `Wallet` table. All the data in the column will be lost.
  - You are about to drop the column `profissionalId` on the `Wallet` table. All the data in the column will be lost.
  - You are about to drop the `BookingExecution` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Consolidation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Payments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Profisional` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Services` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SubCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Verifications` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[bookingCode]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[bookingId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[accountNumber]` on the table `Wallet` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `address` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `channel` on the `Notification` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `professionalId` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accountHolder` to the `Wallet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accountNumber` to the `Wallet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `professionalId` to the `Wallet` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProfessionalType" AS ENUM ('ENTERPRISE', 'INDIVIDUAL');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'STARTED', 'COMPLETED', 'CANCELED');

-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('EMAIL', 'PUSH', 'SMS');

-- CreateEnum
CREATE TYPE "VerificationType" AS ENUM ('ACCOUNT_VERIFICATION', 'PASSWORD_RESET', 'PROFESSIONAL_DOCUMENTS');

-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterEnum
BEGIN;
CREATE TYPE "BookingPriority_new" AS ENUM ('HIGH', 'MEDIUM', 'LOW');
ALTER TABLE "Booking" ALTER COLUMN "priority" TYPE "BookingPriority_new" USING ("priority"::text::"BookingPriority_new");
ALTER TYPE "BookingPriority" RENAME TO "BookingPriority_old";
ALTER TYPE "BookingPriority_new" RENAME TO "BookingPriority";
DROP TYPE "public"."BookingPriority_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "NotificationType_new" AS ENUM ('BOOKING', 'REVIEW', 'SYSTEM', 'ALERT', 'PAYMENT', 'AUTH');
ALTER TABLE "Notification" ALTER COLUMN "type" TYPE "NotificationType_new" USING ("type"::text::"NotificationType_new");
ALTER TYPE "NotificationType" RENAME TO "NotificationType_old";
ALTER TYPE "NotificationType_new" RENAME TO "NotificationType";
DROP TYPE "public"."NotificationType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ServiceLocation_new" AS ENUM ('CLIENT_HOME', 'PROFESSIONAL_HOME', 'PROFESSIONAL_SPACE');
ALTER TABLE "Booking" ALTER COLUMN "location" TYPE "ServiceLocation_new" USING ("location"::text::"ServiceLocation_new");
ALTER TYPE "ServiceLocation" RENAME TO "ServiceLocation_old";
ALTER TYPE "ServiceLocation_new" RENAME TO "ServiceLocation";
DROP TYPE "public"."ServiceLocation_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('CUSTOMER', 'PROFESSIONAL', 'ADMIN');
ALTER TABLE "public"."User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "public"."UserRole_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'CUSTOMER';
COMMIT;

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_profissionalId_fkey";

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "BookingExecution" DROP CONSTRAINT "BookingExecution_bookingId_fkey";

-- DropForeignKey
ALTER TABLE "BookingExecution" DROP CONSTRAINT "BookingExecution_clientId_fkey";

-- DropForeignKey
ALTER TABLE "BookingExecution" DROP CONSTRAINT "BookingExecution_profissionalId_fkey";

-- DropForeignKey
ALTER TABLE "Consolidation" DROP CONSTRAINT "Consolidation_paymentId_fkey";

-- DropForeignKey
ALTER TABLE "Consolidation" DROP CONSTRAINT "Consolidation_profissionalId_fkey";

-- DropForeignKey
ALTER TABLE "Consolidation" DROP CONSTRAINT "Consolidation_walletId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_bookingId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_paymentId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_reviewId_fkey";

-- DropForeignKey
ALTER TABLE "Payments" DROP CONSTRAINT "Payments_bookingId_fkey";

-- DropForeignKey
ALTER TABLE "Payments" DROP CONSTRAINT "Payments_clientId_fkey";

-- DropForeignKey
ALTER TABLE "Payments" DROP CONSTRAINT "Payments_profissionalId_fkey";

-- DropForeignKey
ALTER TABLE "Profisional" DROP CONSTRAINT "Profisional_userId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_profissionalId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "Services" DROP CONSTRAINT "Services_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Services" DROP CONSTRAINT "Services_subCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "SubCategory" DROP CONSTRAINT "SubCategory_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Verifications" DROP CONSTRAINT "Verifications_userId_fkey";

-- DropForeignKey
ALTER TABLE "Wallet" DROP CONSTRAINT "Wallet_profissionalId_fkey";

-- DropIndex
DROP INDEX "Booking_bookingCode_idx";

-- DropIndex
DROP INDEX "Booking_createdAt_idx";

-- DropIndex
DROP INDEX "Booking_profissionalId_idx";

-- DropIndex
DROP INDEX "Booking_scheduleDate_idx";

-- DropIndex
DROP INDEX "Booking_serviceId_idx";

-- DropIndex
DROP INDEX "Category_isActive_featured_idx";

-- DropIndex
DROP INDEX "Category_order_idx";

-- DropIndex
DROP INDEX "Category_slug_idx";

-- DropIndex
DROP INDEX "Notification_createdAt_idx";

-- DropIndex
DROP INDEX "Review_bookingId_idx";

-- DropIndex
DROP INDEX "Review_clientId_idx";

-- DropIndex
DROP INDEX "Review_createdAt_idx";

-- DropIndex
DROP INDEX "Review_isFeatured_idx";

-- DropIndex
DROP INDEX "Review_profissionalId_idx";

-- DropIndex
DROP INDEX "Review_rating_idx";

-- DropIndex
DROP INDEX "Review_serviceId_idx";

-- DropIndex
DROP INDEX "User_createdAt_idx";

-- DropIndex
DROP INDEX "User_tokenToActivate_key";

-- DropIndex
DROP INDEX "Wallet_acountNumber_key";

-- DropIndex
DROP INDEX "Wallet_isActive_idx";

-- DropIndex
DROP INDEX "Wallet_profissionalId_idx";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "adress",
DROP COLUMN "cancellationReaseon",
DROP COLUMN "duration",
DROP COLUMN "profissionalId",
DROP COLUMN "profissionalNodes",
ADD COLUMN     "address" JSONB NOT NULL,
ADD COLUMN     "professionalId" INTEGER,
ADD COLUMN     "professionalNotes" TEXT,
ALTER COLUMN "priority" SET DEFAULT 'MEDIUM',
DROP COLUMN "status",
ADD COLUMN     "status" "BookingStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "coverUrl",
DROP COLUMN "featured",
DROP COLUMN "stats",
DROP COLUMN "tags",
ALTER COLUMN "color" DROP NOT NULL,
ALTER COLUMN "order" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "bookingId",
DROP COLUMN "paymentId",
DROP COLUMN "reviewId",
DROP COLUMN "subject",
DROP COLUMN "updatedAt",
DROP COLUMN "channel",
ADD COLUMN     "channel" "NotificationChannel" NOT NULL;

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "isFeatured",
DROP COLUMN "isRead",
DROP COLUMN "profisionalReply",
DROP COLUMN "profissionalId",
DROP COLUMN "serviceId",
ADD COLUMN     "professionalId" INTEGER NOT NULL,
ADD COLUMN     "professionalReply" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isVerified",
DROP COLUMN "profile",
DROP COLUMN "tokenToActivate",
ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "lastLoginAt" TIMESTAMP(3),
ALTER COLUMN "role" SET DEFAULT 'CUSTOMER',
ALTER COLUMN "stats" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Wallet" DROP COLUMN "acountHolder",
DROP COLUMN "acountNumber",
DROP COLUMN "profissionalId",
ADD COLUMN     "accountHolder" TEXT NOT NULL,
ADD COLUMN     "accountNumber" TEXT NOT NULL,
ADD COLUMN     "professionalId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "BookingExecution";

-- DropTable
DROP TABLE "Consolidation";

-- DropTable
DROP TABLE "Payments";

-- DropTable
DROP TABLE "Profisional";

-- DropTable
DROP TABLE "Services";

-- DropTable
DROP TABLE "SubCategory";

-- DropTable
DROP TABLE "Verifications";

-- DropEnum
DROP TYPE "BookinStatus";

-- DropEnum
DROP TYPE "NotificationChanel";

-- DropEnum
DROP TYPE "ProfisionalType";

-- DropEnum
DROP TYPE "VerificationsType";

-- CreateTable
CREATE TABLE "Verification" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" "VerificationType" NOT NULL,
    "token" TEXT NOT NULL,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "metaData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Professional" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" "ProfessionalType" NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "documentNumber" TEXT NOT NULL,
    "yearsExperience" INTEGER NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verificationStatus" "ApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "specialties" TEXT[],
    "certifications" TEXT[],
    "portfolioUrl" TEXT,
    "coverUrl" TEXT,
    "cvUrl" TEXT,
    "contacts" JSONB,
    "socialMedia" JSONB,
    "stats" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Professional_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfessionalDocument" (
    "id" SERIAL NOT NULL,
    "professionalId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "status" "ApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProfessionalDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceTemplate" (
    "id" SERIAL NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tags" TEXT[],
    "basePrice" INTEGER NOT NULL,
    "duration" INTEGER,
    "priceType" "ServicePriceType" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfessionalServiceRequest" (
    "id" SERIAL NOT NULL,
    "professionalId" INTEGER NOT NULL,
    "serviceId" INTEGER NOT NULL,
    "status" "ApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "adminNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProfessionalServiceRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "bookingId" INTEGER NOT NULL,
    "clientId" INTEGER NOT NULL,
    "professionalId" INTEGER,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paidAt" TIMESTAMP(3),
    "refundedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Verification_token_key" ON "Verification"("token");

-- CreateIndex
CREATE INDEX "Verification_userId_idx" ON "Verification"("userId");

-- CreateIndex
CREATE INDEX "Verification_type_isUsed_idx" ON "Verification"("type", "isUsed");

-- CreateIndex
CREATE UNIQUE INDEX "Professional_userId_key" ON "Professional"("userId");

-- CreateIndex
CREATE INDEX "ProfessionalDocument_professionalId_status_idx" ON "ProfessionalDocument"("professionalId", "status");

-- CreateIndex
CREATE INDEX "ProfessionalServiceRequest_status_idx" ON "ProfessionalServiceRequest"("status");

-- CreateIndex
CREATE UNIQUE INDEX "ProfessionalServiceRequest_professionalId_serviceId_key" ON "ProfessionalServiceRequest"("professionalId", "serviceId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_bookingId_key" ON "Payment"("bookingId");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_bookingCode_key" ON "Booking"("bookingCode");

-- CreateIndex
CREATE INDEX "Booking_professionalId_idx" ON "Booking"("professionalId");

-- CreateIndex
CREATE INDEX "Booking_status_paymentStatus_idx" ON "Booking"("status", "paymentStatus");

-- CreateIndex
CREATE UNIQUE INDEX "Review_bookingId_key" ON "Review"("bookingId");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_accountNumber_key" ON "Wallet"("accountNumber");

-- AddForeignKey
ALTER TABLE "Verification" ADD CONSTRAINT "Verification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Professional" ADD CONSTRAINT "Professional_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfessionalDocument" ADD CONSTRAINT "ProfessionalDocument_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "Professional"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceTemplate" ADD CONSTRAINT "ServiceTemplate_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfessionalServiceRequest" ADD CONSTRAINT "ProfessionalServiceRequest_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "Professional"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfessionalServiceRequest" ADD CONSTRAINT "ProfessionalServiceRequest_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "ServiceTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "Professional"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "ServiceTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "Professional"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "Professional"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "Professional"("id") ON DELETE CASCADE ON UPDATE CASCADE;
