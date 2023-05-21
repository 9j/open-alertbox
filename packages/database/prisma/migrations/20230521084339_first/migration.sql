-- CreateEnum
CREATE TYPE "AlertType" AS ENUM ('DONATION', 'SUBSCRIPTION', 'FOLLOW');

-- CreateTable
CREATE TABLE "AlertEvent" (
    "id" TEXT NOT NULL,
    "type" "AlertType" NOT NULL,
    "name" TEXT NOT NULL,
    "message" TEXT,
    "amount" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AlertEvent_pkey" PRIMARY KEY ("id")
);
