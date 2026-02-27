-- AlterTable
ALTER TABLE "IncidentMedia" ADD COLUMN     "uploadedById" TEXT,
ADD COLUMN     "uploaderRole" TEXT;

-- AddForeignKey
ALTER TABLE "IncidentMedia" ADD CONSTRAINT "IncidentMedia_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
