const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  console.log('🚀 Starting province data fix...');

  // 1. Fetch all provinces
  const provinces = await p.province.findMany();
  const provMapBySlug = {};
  const provMapByName = {};

  for (const prov of provinces) {
    provMapByName[prov.name] = prov.id;
    const slug = prov.name.replace(/\s+/g, '').toLowerCase(); // e.g. "easterncape", "freestate", "gauteng"
    provMapBySlug[slug] = prov.id;
  }
  console.log('Provinces found:', Object.keys(provMapByName));

  // 2. Fix all users missing provinceId
  const users = await p.user.findMany({
    include: {
      province: true,
      department: { include: { building: { include: { province: true } } } }
    }
  });

  let usersUpdated = 0;

  for (const user of users) {
    let targetProvinceId = user.provinceId || user.department?.building?.provinceId;

    if (!targetProvinceId) {
      const email = user.email.toLowerCase();
      // Match email domain prefix e.g. "supervisor.freestate@dlrrd.gov.za" or "employee.gauteng@dlrrd.gov.za"
      for (const [slug, provId] of Object.entries(provMapBySlug)) {
        if (email.includes(slug)) {
          targetProvinceId = provId;
          break;
        }
      }

      // Check name if email didn't match
      if (!targetProvinceId) {
        for (const [name, provId] of Object.entries(provMapByName)) {
          if (user.name.toLowerCase().includes(name.toLowerCase())) {
            targetProvinceId = provId;
            break;
          }
        }
      }
    }

    if (targetProvinceId && user.provinceId !== targetProvinceId) {
      await p.user.update({
        where: { id: user.id },
        data: { provinceId: targetProvinceId }
      });
      usersUpdated++;
      console.log(`Updated user ${user.name} (${user.email}) -> provinceId: ${targetProvinceId}`);
    }
  }

  console.log(`✅ Updated ${usersUpdated} users with provinceId.`);

  // 3. Fix all incidents missing provinceId and re-link Free State / other province incidents
  const incidents = await p.incident.findMany({
    include: { building: true, reportedBy: true }
  });

  let incidentsUpdated = 0;

  // Find employees for provinces
  const freeStateEmp = await p.user.findFirst({
    where: { email: 'employee.freestate@dlrrd.gov.za' }
  });
  const gautengEmp = await p.user.findFirst({
    where: { email: 'employee.gauteng@dlrrd.gov.za' }
  });
  const kznEmp = await p.user.findFirst({
    where: { email: 'employee.kwazulu-natal@dlrrd.gov.za' }
  });
  const limpopoEmp = await p.user.findFirst({
    where: { email: 'employee.limpopo@dlrrd.gov.za' }
  });
  const easternCapeEmp = await p.user.findFirst({
    where: { email: 'employee.easterncape@dlrrd.gov.za' }
  });

  for (const inc of incidents) {
    const provId = inc.building?.provinceId;
    let newReportedById = inc.reportedById;

    // Re-assign reportedById based on incident building province so each employee has cases they reported
    if (inc.building?.provinceId === provMapByName['Free State'] && freeStateEmp) {
      newReportedById = freeStateEmp.id;
    } else if (inc.building?.provinceId === provMapByName['Gauteng'] && gautengEmp) {
      newReportedById = gautengEmp.id;
    } else if (inc.building?.provinceId === provMapByName['KwaZulu-Natal'] && kznEmp) {
      newReportedById = kznEmp.id;
    } else if (inc.building?.provinceId === provMapByName['Limpopo'] && limpopoEmp) {
      newReportedById = limpopoEmp.id;
    } else if (inc.building?.provinceId === provMapByName['Eastern Cape'] && easternCapeEmp) {
      newReportedById = easternCapeEmp.id;
    }

    if (provId || newReportedById !== inc.reportedById) {
      await p.incident.update({
        where: { id: inc.id },
        data: {
          provinceId: provId || inc.provinceId,
          reportedById: newReportedById
        }
      });
      incidentsUpdated++;
      console.log(`Updated incident ${inc.incidentNumber} -> provinceId: ${provId}, reportedById: ${newReportedById}`);
    }
  }

  console.log(`✅ Updated ${incidentsUpdated} incidents with provinceId and reportedById.`);
}

main()
  .then(() => p.$disconnect())
  .catch(e => {
    console.error(e);
    p.$disconnect();
    process.exit(1);
  });
