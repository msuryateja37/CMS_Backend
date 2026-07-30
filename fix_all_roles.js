const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

const roleMap = {
  'supervisor': 'SUPERVISOR',
  'ohspractitioner': 'OHS_PRACTITIONER',
  'firstaider': 'FIRST_AIDER',
  'hr': 'HR',
  'pssccoordinator': 'PSSC_COORDINATOR',
  'deputydirector': 'DEPUTY_DIRECTOR',
  'facilitiescoordinator': 'FACILITIES_COORDINATOR',
  'chiefdirector': 'CHIEF_DIRECTOR',
  'admin': 'SYSTEM_ADMINISTRATOR',
  'manager': 'MANAGER',
  'finance': 'FINANCE_OFFICIAL',
};

async function main() {
  // Get all role records from DB
  const allRoles = await p.role.findMany();
  const rolesById = {};
  const rolesByName = {};
  for (const r of allRoles) {
    rolesById[r.id] = r.name;
    rolesByName[r.name] = r;
  }
  console.log('Existing roles in DB:', Object.keys(rolesByName));

  // Get all users with no roles
  const usersWithNoRoles = await p.user.findMany({
    where: { roles: { none: {} }, isActive: true },
    select: { id: true, email: true }
  });
  
  console.log(`\nUsers with NO roles to fix: ${usersWithNoRoles.length}`);
  
  let assigned = 0;
  let skipped = 0;
  
  for (const user of usersWithNoRoles) {
    const emailPrefix = user.email.split('@')[0]; // e.g. 'supervisor.gauteng' or 'admin'
    const rolePart = emailPrefix.split('.')[0]; // e.g. 'supervisor', 'admin', 'finance'
    
    let roleName = roleMap[rolePart];
    
    // Special cases
    if (!roleName && rolePart === 'ohspractitioner') {
      // Check if national office
      if (user.email.includes('nationaloffice')) {
        roleName = 'OHS_NATIONAL_OFFICE';
      } else {
        roleName = 'OHS_PRACTITIONER';
      }
    }
    
    if (!roleName) {
      console.log(`  SKIP: Cannot determine role for ${user.email} (prefix: ${rolePart})`);
      skipped++;
      continue;
    }
    
    const role = rolesByName[roleName];
    if (!role) {
      console.log(`  SKIP: Role ${roleName} not found in DB for ${user.email}`);
      skipped++;
      continue;
    }
    
    await p.userRole.create({
      data: { userId: user.id, roleId: role.id }
    });
    console.log(`  Assigned ${roleName} to ${user.email}`);
    assigned++;
  }
  
  console.log(`\nDone! Assigned roles to ${assigned} users. Skipped ${skipped}.`);
  
  // Verify the fix
  const stillNoRoles = await p.user.findMany({
    where: { roles: { none: {} }, isActive: true },
  });
  console.log(`Users still without roles: ${stillNoRoles.length}`);
  if (stillNoRoles.length > 0) {
    for (const u of stillNoRoles) console.log(`  - ${u.email}`);
  }
}

main().then(() => p.$disconnect()).catch(e => { console.error(e); p.$disconnect(); process.exit(1); });
