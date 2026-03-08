/*
  Warnings:

  - A unique constraint covering the columns `[hashedToken]` on the table `Token` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Token" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';

-- CreateIndex
CREATE UNIQUE INDEX "Token_hashedToken_key" ON "Token"("hashedToken");
