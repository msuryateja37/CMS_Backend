/*
  Warnings:

  - Added the required column `entity` to the `SyncQueue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `entityId` to the `SyncQueue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SyncQueue" ADD COLUMN     "entity" TEXT NOT NULL,
ADD COLUMN     "entityId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT;
