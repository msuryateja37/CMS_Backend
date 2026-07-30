const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  // Find the EMPLOYEE role
  const employeeRole = await p.role.findFirst({ where: { name: 'EMPLOYEE' } });
  if (!employeeRole) {
    console.log('EMPLOYEE role not found! Creating it...');
    const newRole = await p.role.create({ data: { name: 'EMPLOYEE' } });
    console.log('Created EMPLOYEE role:', newRole.id);
    employeeRole = newRole;
  }
  console.log('EMPLOYEE role ID:', employeeRole.id);

  // Find all users with 'employee.' in their email
  const employees = await p.user.findMany({
    where: { email: { contains: 'employee.' } },
    include: { roles: true }
  });
  
  console.log(`Found ${employees.length} employee users`);

  let assigned = 0;
  for (const emp of employees) {
    if (emp.roles.length === 0) {
      // Check if assignment already exists (shouldn't, but just in case)
      const existing = await p.userRole.findFirst({
        where: { userId: emp.id, roleId: employeeRole.id }
      });
      if (!existing) {
        await p.userRole.create({
          data: { userId: emp.id, roleId: employeeRole.id }
        });
        console.log(`Assigned EMPLOYEE role to ${emp.email}`);
        assigned++;
      }
    } else {
      console.log(`${emp.email} already has roles: ${JSON.stringify(emp.roles.map(r => r.roleId))}`);
    }
  }

  console.log(`\nDone! Assigned EMPLOYEE role to ${assigned} users.`);
  
  // Verify
  const verified = await p.user.findMany({
    where: { email: { contains: 'employee.' } },
    include: { roles: { include: { role: true } } }
  });
  for (const u of verified) {
    console.log(`${u.email} => roles: ${JSON.stringify(u.roles.map(r => r.role.name))}`);
  }
}

main().then(() => p.$disconnect()).catch(e => { console.error(e); p.$disconnect(); process.exit(1); });
