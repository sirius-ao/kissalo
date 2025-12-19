-- DropIndex
DROP INDEX "Profisional_status_idx";

-- DropIndex
DROP INDEX "Services_categoryId_idx";

-- DropIndex
DROP INDEX "User_id_idx";

-- DropIndex
DROP INDEX "User_role_idx";

-- CreateIndex
CREATE INDEX "Booking_bookingCode_idx" ON "Booking"("bookingCode");

-- CreateIndex
CREATE INDEX "Booking_status_paymentStatus_idx" ON "Booking"("status", "paymentStatus");

-- CreateIndex
CREATE INDEX "Booking_scheduleDate_idx" ON "Booking"("scheduleDate");

-- CreateIndex
CREATE INDEX "Booking_createdAt_idx" ON "Booking"("createdAt");

-- CreateIndex
CREATE INDEX "BookingExecution_bookingId_idx" ON "BookingExecution"("bookingId");

-- CreateIndex
CREATE INDEX "BookingExecution_profissionalId_isOpen_idx" ON "BookingExecution"("profissionalId", "isOpen");

-- CreateIndex
CREATE INDEX "BookingExecution_clientId_idx" ON "BookingExecution"("clientId");

-- CreateIndex
CREATE INDEX "BookingExecution_expiredAt_idx" ON "BookingExecution"("expiredAt");

-- CreateIndex
CREATE INDEX "Category_slug_idx" ON "Category"("slug");

-- CreateIndex
CREATE INDEX "Category_isActive_featured_idx" ON "Category"("isActive", "featured");

-- CreateIndex
CREATE INDEX "Category_order_idx" ON "Category"("order");

-- CreateIndex
CREATE INDEX "Consolidation_profissionalId_idx" ON "Consolidation"("profissionalId");

-- CreateIndex
CREATE INDEX "Consolidation_paymentId_idx" ON "Consolidation"("paymentId");

-- CreateIndex
CREATE INDEX "Consolidation_walletId_idx" ON "Consolidation"("walletId");

-- CreateIndex
CREATE INDEX "Consolidation_sheduledAt_idx" ON "Consolidation"("sheduledAt");

-- CreateIndex
CREATE INDEX "Notification_userId_isRead_idx" ON "Notification"("userId", "isRead");

-- CreateIndex
CREATE INDEX "Notification_type_idx" ON "Notification"("type");

-- CreateIndex
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");

-- CreateIndex
CREATE INDEX "Payments_status_idx" ON "Payments"("status");

-- CreateIndex
CREATE INDEX "Payments_createdAt_idx" ON "Payments"("createdAt");

-- CreateIndex
CREATE INDEX "Profisional_userId_idx" ON "Profisional"("userId");

-- CreateIndex
CREATE INDEX "Profisional_status_isVerified_idx" ON "Profisional"("status", "isVerified");

-- CreateIndex
CREATE INDEX "Profisional_averageRating_idx" ON "Profisional"("averageRating");

-- CreateIndex
CREATE INDEX "Profisional_yearsExperience_idx" ON "Profisional"("yearsExperience");

-- CreateIndex
CREATE INDEX "Review_rating_idx" ON "Review"("rating");

-- CreateIndex
CREATE INDEX "Review_isFeatured_idx" ON "Review"("isFeatured");

-- CreateIndex
CREATE INDEX "Review_createdAt_idx" ON "Review"("createdAt");

-- CreateIndex
CREATE INDEX "Services_categoryId_isActive_idx" ON "Services"("categoryId", "isActive");

-- CreateIndex
CREATE INDEX "Services_priceType_idx" ON "Services"("priceType");

-- CreateIndex
CREATE INDEX "Services_createdAt_idx" ON "Services"("createdAt");

-- CreateIndex
CREATE INDEX "SubCategory_categoryId_idx" ON "SubCategory"("categoryId");

-- CreateIndex
CREATE INDEX "SubCategory_slug_idx" ON "SubCategory"("slug");

-- CreateIndex
CREATE INDEX "SubCategory_isActive_idx" ON "SubCategory"("isActive");

-- CreateIndex
CREATE INDEX "User_phone_idx" ON "User"("phone");

-- CreateIndex
CREATE INDEX "User_role_status_idx" ON "User"("role", "status");

-- CreateIndex
CREATE INDEX "User_createdAt_idx" ON "User"("createdAt");

-- CreateIndex
CREATE INDEX "Verifications_token_idx" ON "Verifications"("token");

-- CreateIndex
CREATE INDEX "Verifications_type_isUsed_idx" ON "Verifications"("type", "isUsed");

-- CreateIndex
CREATE INDEX "Verifications_expiresAt_idx" ON "Verifications"("expiresAt");

-- CreateIndex
CREATE INDEX "Wallet_profissionalId_idx" ON "Wallet"("profissionalId");

-- CreateIndex
CREATE INDEX "Wallet_isActive_idx" ON "Wallet"("isActive");
