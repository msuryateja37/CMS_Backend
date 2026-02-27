-- AlterTable
ALTER TABLE "EmergencyPlan" ADD COLUMN     "documentPath" TEXT;

-- AlterTable
ALTER TABLE "Equipment" ADD COLUMN     "lastChecked" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "IncidentStatusLog" ALTER COLUMN "oldStatus" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "invoiceNumber" TEXT,
ADD COLUMN     "receivedDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;
