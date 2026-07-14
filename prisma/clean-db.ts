import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Cleaning database incident and investigation records...');
  
  // Clean investigation logs/findings if any
  try { await prisma.investigation.deleteMany(); } catch(e) {}
  try { await prisma.invoice.deleteMany(); } catch(e) {}
  try { await prisma.incidentAssignment.deleteMany(); } catch(e) {}
  try { await prisma.incidentMedia.deleteMany(); } catch(e) {}
  try { await prisma.incidentComment.deleteMany(); } catch(e) {}
  try { await prisma.incidentStatusLog.deleteMany(); } catch(e) {}
  try { await prisma.correctiveAction.deleteMany(); } catch(e) {}
  try { await prisma.approvalAttachment.deleteMany(); } catch(e) {}
  try { await prisma.approval.deleteMany(); } catch(e) {}
  try { await prisma.incidentSLATracking.deleteMany(); } catch(e) {}
  try { await prisma.impactedPerson.deleteMany(); } catch(e) {}
  try { await prisma.wclRecord.deleteMany(); } catch(e) {}
  try { await prisma.annexureOne.deleteMany(); } catch(e) {}
  try { await prisma.incident.deleteMany(); } catch(e) {}

  console.log('✅ Database incidents cleared successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Failed to clean database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
