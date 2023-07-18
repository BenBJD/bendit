/*
  Warnings:

  - You are about to drop the column `ownerId` on the `Subbendit` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Subbendit" DROP CONSTRAINT "Subbendit_User_id_fk";

-- AlterTable
ALTER TABLE "Subbendit" DROP COLUMN "ownerId",
ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "Subbendit" ADD CONSTRAINT "Subbendit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
