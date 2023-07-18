/*
  Warnings:

  - Added the required column `ownerId` to the `Subbendit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Subbendit" ADD COLUMN     "ownerId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Subbendit" ADD CONSTRAINT "Subbendit_User_id_fk" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
