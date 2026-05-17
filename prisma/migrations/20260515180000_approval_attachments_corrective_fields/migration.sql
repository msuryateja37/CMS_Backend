-- Approval: move file columns to ApprovalAttachment; add metadata columns.
-- CorrectiveAction: add workflow fields.

CREATE TABLE IF NOT EXISTS "ApprovalAttachment" (
    "id" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileName" TEXT,
    "fileType" TEXT,
    "approvalId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ApprovalAttachment_pkey" PRIMARY KEY ("id")
);

-- Copy legacy single-file columns into attachments (PostgreSQL)
INSERT INTO "ApprovalAttachment" ("id", "fileUrl", "fileName", "fileType", "approvalId", "createdAt")
SELECT gen_random_uuid()::text,
       a."fileUrl",
       a."fileName",
       a."fileType",
       a."id",
       a."createdAt"
FROM "Approval" a
WHERE EXISTS (
    SELECT 1 FROM information_schema.columns c
    WHERE c.table_name = 'Approval' AND c.column_name = 'fileUrl'
)
AND a."fileUrl" IS NOT NULL AND length(trim(a."fileUrl")) > 0
AND NOT EXISTS (SELECT 1 FROM "ApprovalAttachment" x WHERE x."approvalId" = a."id");

ALTER TABLE "Approval" ADD COLUMN IF NOT EXISTS "recommenderName" TEXT;
ALTER TABLE "Approval" ADD COLUMN IF NOT EXISTS "recommendationText" TEXT;
ALTER TABLE "Approval" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE "Approval" DROP COLUMN IF EXISTS "fileUrl";
ALTER TABLE "Approval" DROP COLUMN IF EXISTS "fileName";
ALTER TABLE "Approval" DROP COLUMN IF EXISTS "fileType";

DO $$ BEGIN
  ALTER TABLE "ApprovalAttachment" ADD CONSTRAINT "ApprovalAttachment_approvalId_fkey"
    FOREIGN KEY ("approvalId") REFERENCES "Approval"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS "ApprovalAttachment_approvalId_idx" ON "ApprovalAttachment"("approvalId");

ALTER TABLE "CorrectiveAction" ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL DEFAULT 'pending';
ALTER TABLE "CorrectiveAction" ADD COLUMN IF NOT EXISTS "dueDate" TIMESTAMP(3);
ALTER TABLE "CorrectiveAction" ADD COLUMN IF NOT EXISTS "completedAt" TIMESTAMP(3);
ALTER TABLE "CorrectiveAction" ADD COLUMN IF NOT EXISTS "notes" TEXT;
ALTER TABLE "CorrectiveAction" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Widen action text if needed (Prisma @db.Text)
DO $$ BEGIN
  ALTER TABLE "CorrectiveAction" ALTER COLUMN "actionText" TYPE TEXT;
EXCEPTION WHEN others THEN NULL;
END $$;
