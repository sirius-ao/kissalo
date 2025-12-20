/*
  Warnings:

  - The `contacts` column on the `Professional` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `fileUrl` on the `ProfessionalDocument` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `ProfessionalDocument` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `ServiceTemplate` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[professionalId]` on the table `ProfessionalDocument` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `ServiceTemplate` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `ServiceTemplate` table without a default value. This is not possible if the table is not empty.
  - Made the column `duration` on table `ServiceTemplate` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Professional" ADD COLUMN     "autoSelect" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "contacts",
ADD COLUMN     "contacts" TEXT[];

-- AlterTable
ALTER TABLE "ProfessionalDocument" DROP COLUMN "fileUrl",
DROP COLUMN "type",
ADD COLUMN     "files" TEXT[];

-- AlterTable
ALTER TABLE "ServiceTemplate" DROP COLUMN "tags",
ADD COLUMN     "bannerUrl" TEXT,
ADD COLUMN     "bookingsCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'AOA',
ADD COLUMN     "deliverables" TEXT,
ADD COLUMN     "gallery" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isNegotiable" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "keywords" TEXT[],
ADD COLUMN     "maxBookings" INTEGER,
ADD COLUMN     "maxPrice" INTEGER,
ADD COLUMN     "maxRequestsPerDay" INTEGER,
ADD COLUMN     "minPrice" INTEGER,
ADD COLUMN     "ratingAverage" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "ratingCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "requirements" TEXT[],
ADD COLUMN     "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "shortDescription" TEXT,
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "videoUrl" TEXT,
ADD COLUMN     "viewsCount" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "duration" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ProfessionalDocument_professionalId_key" ON "ProfessionalDocument"("professionalId");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceTemplate_slug_key" ON "ServiceTemplate"("slug");

-- CreateIndex
CREATE INDEX "ServiceTemplate_categoryId_idx" ON "ServiceTemplate"("categoryId");

-- CreateIndex
CREATE INDEX "ServiceTemplate_isActive_idx" ON "ServiceTemplate"("isActive");

-- CreateIndex
CREATE INDEX "ServiceTemplate_priceType_idx" ON "ServiceTemplate"("priceType");
