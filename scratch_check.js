const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  const incidents = await p.incident.findMany({
    include: {
      reportedBy: { include: { province: true } },
      province: true,
      building: { include: { province: true } }
    }
  });

  console.log(`Total incidents in DB: ${incidents.length}`);
  for (const inc of incidents) {
    console.log(`\nID: ${inc.id} (${inc.incidentNumber})`);
    console.log(`  Category: ${inc.category}, Status: ${inc.status}`);
    console.log(`  Reported By: ${inc.reportedBy?.name} (${inc.reportedBy?.email}), ID: ${inc.reportedById}`);
    console.log(`  ReportedBy Prov: ${inc.reportedBy?.province?.name} (id: ${inc.reportedBy?.provinceId})`);
    console.log(`  Incident Prov: ${inc.province?.name} (id: ${inc.provinceId})`);
    console.log(`  Building Prov: ${inc.building?.province?.name} (id: ${inc.building?.provinceId})`);
  }
}

main().then(() => p.$disconnect()).catch(e => { console.error(e); p.$disconnect(); });
