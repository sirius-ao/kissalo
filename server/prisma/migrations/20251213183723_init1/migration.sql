-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('PROFISIONAL', 'COSTUMER', 'ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "ProfisionalType" AS ENUM ('ENTERPRISE', 'INDIVIDUAL');

-- CreateEnum
CREATE TYPE "ServicePriceType" AS ENUM ('FIXED', 'HOURLY');

-- CreateEnum
CREATE TYPE "ServiceLocation" AS ENUM ('CLIENT_HOME', 'PROFISIONAL_HOME', 'PROFISIONAL_SPACE');

-- CreateEnum
CREATE TYPE "BookinStatus" AS ENUM ('PENDING', 'COMPLETED', 'STARTED', 'CANCELED', 'CONFIRMADED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PAID', 'PENDING', 'REFUNDED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('BOOKING', 'REVIEW', 'SYTEM', 'ALERT', 'PAYMENT');

-- CreateEnum
CREATE TYPE "NotificationChanel" AS ENUM ('EMAIl', 'PUSH', 'SMS');

-- CreateEnum
CREATE TYPE "BookingPriority" AS ENUM ('HIGH', 'MIDIUM', 'LOW');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "profile" TEXT,
    "password" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "role" "UserRole" NOT NULL DEFAULT 'COSTUMER',
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "stats" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecoveryAccountRequest" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "metaData" JSONB,

    CONSTRAINT "RecoveryAccountRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profisional" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "waletId" INTEGER NOT NULL,
    "type" "ProfisionalType" NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "documentNumber" TEXT NOT NULL,
    "especialities" TEXT[],
    "certifications" TEXT[],
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "averageRating" DOUBLE PRECISION NOT NULL,
    "yearsExperience" INTEGER NOT NULL,
    "portfolioUrl" TEXT,
    "coverUrl" TEXT,
    "cvUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "stats" JSONB NOT NULL,
    "contacts" JSONB NOT NULL,
    "socialMidea" JSONB NOT NULL,

    CONSTRAINT "Profisional_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "tags" TEXT[],
    "color" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT true,
    "coverUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "stats" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubCategory" (
    "id" SERIAL NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "tags" TEXT[],
    "order" INTEGER NOT NULL,
    "stats" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Services" (
    "id" SERIAL NOT NULL,
    "profissionalId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "subCategoryId" INTEGER,
    "title" TEXT NOT NULL,
    "descrition" TEXT NOT NULL,
    "tags" TEXT[],
    "images" TEXT[],
    "basePrice" INTEGER NOT NULL,
    "duration" INTEGER,
    "priceType" "ServicePriceType" NOT NULL,
    "requeriments" TEXT[],
    "includes" TEXT[],
    "notes" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "stats" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" SERIAL NOT NULL,
    "bookingCode" TEXT NOT NULL,
    "clientId" INTEGER NOT NULL,
    "profissionalId" INTEGER NOT NULL,
    "serviceId" INTEGER NOT NULL,
    "scheduleDate" TIMESTAMP(3) NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "adress" JSONB NOT NULL,
    "location" "ServiceLocation" NOT NULL,
    "priority" "BookingPriority" NOT NULL,
    "status" "BookinStatus" NOT NULL DEFAULT 'PENDING',
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "totalAmount" INTEGER NOT NULL,
    "cancellationReaseon" TEXT,
    "clientNotes" TEXT,
    "profissionalNodes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookingExecution" (
    "id" SERIAL NOT NULL,
    "profissionalId" INTEGER NOT NULL,
    "clientId" INTEGER NOT NULL,
    "bookingId" INTEGER NOT NULL,
    "optCode" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiredAt" TIMESTAMP(3) NOT NULL,
    "acceptedAt" TIMESTAMP(3),
    "isAcepted" BOOLEAN NOT NULL DEFAULT false,
    "isOpen" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "BookingExecution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payments" (
    "id" SERIAL NOT NULL,
    "bookingId" INTEGER NOT NULL,
    "clientId" INTEGER NOT NULL,
    "profissionalId" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "comprovativeUrl" TEXT,
    "iban" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "paidAt" TIMESTAMP(3),
    "refunedAt" TIMESTAMP(3),

    CONSTRAINT "Payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" SERIAL NOT NULL,
    "bookingId" INTEGER NOT NULL,
    "clientId" INTEGER NOT NULL,
    "profissionalId" INTEGER NOT NULL,
    "serviceId" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "profisionalReply" TEXT,
    "repliedAt" TIMESTAMP(3),
    "isFeatured" BOOLEAN NOT NULL DEFAULT true,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "deepLink" TEXT,
    "bookingId" INTEGER,
    "reviewId" INTEGER,
    "paymentId" INTEGER,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "channel" "NotificationChanel" NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wallet" (
    "id" SERIAL NOT NULL,
    "profissionalId" INTEGER NOT NULL,
    "bankName" TEXT NOT NULL,
    "acountNumber" TEXT NOT NULL,
    "acountHolder" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Consolidation" (
    "id" SERIAL NOT NULL,
    "profissionalId" INTEGER NOT NULL,
    "paymentId" INTEGER NOT NULL,
    "walletId" INTEGER NOT NULL,
    "commition" INTEGER NOT NULL,
    "totalAmount" INTEGER NOT NULL,
    "totalProfisionalEarnings" INTEGER NOT NULL,
    "notes" TEXT,
    "sheduledAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Consolidation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_id_idx" ON "User"("id");

-- CreateIndex
CREATE INDEX "Profisional_status_idx" ON "Profisional"("status");

-- CreateIndex
CREATE INDEX "Profisional_type_idx" ON "Profisional"("type");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "SubCategory_slug_key" ON "SubCategory"("slug");

-- CreateIndex
CREATE INDEX "Services_profissionalId_idx" ON "Services"("profissionalId");

-- CreateIndex
CREATE INDEX "Services_categoryId_idx" ON "Services"("categoryId");

-- CreateIndex
CREATE INDEX "Services_subCategoryId_idx" ON "Services"("subCategoryId");

-- CreateIndex
CREATE INDEX "Booking_profissionalId_idx" ON "Booking"("profissionalId");

-- CreateIndex
CREATE INDEX "Booking_serviceId_idx" ON "Booking"("serviceId");

-- CreateIndex
CREATE INDEX "Booking_clientId_idx" ON "Booking"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "BookingExecution_bookingId_key" ON "BookingExecution"("bookingId");

-- CreateIndex
CREATE INDEX "Payments_profissionalId_idx" ON "Payments"("profissionalId");

-- CreateIndex
CREATE INDEX "Payments_bookingId_idx" ON "Payments"("bookingId");

-- CreateIndex
CREATE INDEX "Payments_clientId_idx" ON "Payments"("clientId");

-- CreateIndex
CREATE INDEX "Review_bookingId_idx" ON "Review"("bookingId");

-- CreateIndex
CREATE INDEX "Review_clientId_idx" ON "Review"("clientId");

-- CreateIndex
CREATE INDEX "Review_profissionalId_idx" ON "Review"("profissionalId");

-- CreateIndex
CREATE INDEX "Review_serviceId_idx" ON "Review"("serviceId");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_acountNumber_key" ON "Wallet"("acountNumber");

-- AddForeignKey
ALTER TABLE "RecoveryAccountRequest" ADD CONSTRAINT "RecoveryAccountRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profisional" ADD CONSTRAINT "Profisional_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubCategory" ADD CONSTRAINT "SubCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Services" ADD CONSTRAINT "Services_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Services" ADD CONSTRAINT "Services_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "SubCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_profissionalId_fkey" FOREIGN KEY ("profissionalId") REFERENCES "Profisional"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingExecution" ADD CONSTRAINT "BookingExecution_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingExecution" ADD CONSTRAINT "BookingExecution_profissionalId_fkey" FOREIGN KEY ("profissionalId") REFERENCES "Profisional"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingExecution" ADD CONSTRAINT "BookingExecution_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payments" ADD CONSTRAINT "Payments_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payments" ADD CONSTRAINT "Payments_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payments" ADD CONSTRAINT "Payments_profissionalId_fkey" FOREIGN KEY ("profissionalId") REFERENCES "Profisional"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_profissionalId_fkey" FOREIGN KEY ("profissionalId") REFERENCES "Profisional"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_profissionalId_fkey" FOREIGN KEY ("profissionalId") REFERENCES "Profisional"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consolidation" ADD CONSTRAINT "Consolidation_profissionalId_fkey" FOREIGN KEY ("profissionalId") REFERENCES "Profisional"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consolidation" ADD CONSTRAINT "Consolidation_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consolidation" ADD CONSTRAINT "Consolidation_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
