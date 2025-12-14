/*
  Warnings:

  - The values [ACCOUNT,RESET_PASS_REQUEST] on the enum `VerificationsType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "VerificationsType_new" AS ENUM ('ACCOUNT_VRIFICATION', 'RESET_PASSWORD_REQUEST');
ALTER TABLE "Verifications" ALTER COLUMN "type" TYPE "VerificationsType_new" USING ("type"::text::"VerificationsType_new");
ALTER TYPE "VerificationsType" RENAME TO "VerificationsType_old";
ALTER TYPE "VerificationsType_new" RENAME TO "VerificationsType";
DROP TYPE "public"."VerificationsType_old";
COMMIT;
