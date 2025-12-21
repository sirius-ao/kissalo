-- CreateTable
CREATE TABLE "ConcliationPayment" (
    "id" SERIAL NOT NULL,
    "paymentId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ConcliationPayment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ConcliationPayment_paymentId_key" ON "ConcliationPayment"("paymentId");

-- AddForeignKey
ALTER TABLE "ConcliationPayment" ADD CONSTRAINT "ConcliationPayment_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConcliationPayment" ADD CONSTRAINT "ConcliationPayment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
