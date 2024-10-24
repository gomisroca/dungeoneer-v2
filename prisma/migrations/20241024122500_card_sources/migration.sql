/*
  Warnings:

  - You are about to drop the column `drops` on the `CardSource` table. All the data in the column will be lost.
  - You are about to drop the column `npcs` on the `CardSource` table. All the data in the column will be lost.
  - You are about to drop the column `packs` on the `CardSource` table. All the data in the column will be lost.
  - Added the required column `text` to the `CardSource` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `CardSource` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CardSource" DROP COLUMN "drops",
DROP COLUMN "npcs",
DROP COLUMN "packs",
ADD COLUMN     "text" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;
