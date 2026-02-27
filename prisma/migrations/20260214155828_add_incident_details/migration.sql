-- AlterTable
ALTER TABLE "Incident" ADD COLUMN     "location" TEXT,
ADD COLUMN     "otherActions" TEXT,
ADD COLUMN     "peopleImpacted" INTEGER;

-- CreateTable
CREATE TABLE "ImpactedPerson" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "incidentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ImpactedPerson_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ImpactedPerson" ADD CONSTRAINT "ImpactedPerson_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "Incident"("id") ON DELETE CASCADE ON UPDATE CASCADE;
