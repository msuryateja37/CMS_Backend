-- AlterTable
ALTER TABLE "Building" ADD COLUMN     "postalCode" TEXT;

-- AlterTable
ALTER TABLE "Department" ADD COLUMN     "buildingId" TEXT;

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "Building"("id") ON DELETE SET NULL ON UPDATE CASCADE;
