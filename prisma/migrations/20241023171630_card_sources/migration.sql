/*
  Warnings:

  - You are about to drop the column `text` on the `CardSource` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `CardSource` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CardSource" DROP COLUMN "text",
DROP COLUMN "type",
ADD COLUMN     "drops" TEXT[],
ADD COLUMN     "npcs" TEXT[],
ADD COLUMN     "packs" TEXT[];
