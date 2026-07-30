const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  // Check all roles and their user counts
  const roles = await p.role.findMany({
    include: { users: { include: { user: { select: { email: true, isActive: true } } } } }
  });
  
  for (const role of roles) {
    console.log(`\nRole: ${role.name} (${role.users.length} users)`);
    for (const ur of role.users.slice(0, 3)) {
      console.log(`  - ${ur.user.email} (active: ${ur.user.isActive})`);
    }
    if (role.users.length > 3) console.log(`  ... and ${role.users.length - 3} more`);
  }
  
  // Specifically check users without roles
  const usersWithNoRoles = await p.user.findMany({
    where: { roles: { none: {} } },
    select: { email: true, isActive: true }
  });
  console.log(`\n\nUsers with NO roles: ${usersWithNoRoles.length}`);
  for (const u of usersWithNoRoles) {
    console.log(`  - ${u.email}`);
  }
}

main().then(() => p.$disconnect()).catch(e => { console.error(e); p.$disconnect(); process.exit(1); });
