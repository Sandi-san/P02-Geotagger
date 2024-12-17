/*
  Warnings:

  - You are about to drop the `UserAction` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserAction" DROP CONSTRAINT "UserAction_userId_fkey";

-- DropTable
DROP TABLE "UserAction";

-- CreateTable
CREATE TABLE "userActions" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "action" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "newValue" INTEGER,
    "url" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "userActions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "userActions_createdAt_userId_idx" ON "userActions"("createdAt", "userId");

-- AddForeignKey
ALTER TABLE "userActions" ADD CONSTRAINT "userActions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
