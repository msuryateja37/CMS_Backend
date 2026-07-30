const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
async function main() {
  // Check all users starting with 'employee'
  const users = await p.user.findMany({
    where: { email: { contains: 'employee' } },
    include: { roles: { include: { role: true } } },
  });
  console.log(`Total employee users: ${users.length}`);
  for (const u of users) {
    const roleNames = u.roles.map(r => r.role.name);
    console.log(`${u.email} => isActive: ${u.isActive}, roles: ${JSON.stringify(roleNames)}`);
  }
  
  // Also check what a login attempt for employee.gauteng returns
  const gautengEmp = await p.user.findUnique({
    where: { email: 'employee.gauteng@dlrrd.gov.za' },
    include: { roles: { include: { role: true } } }
  });
  console.log('\nGauteng employee lookup:', JSON.stringify({
    found: !!gautengEmp,
    isActive: gautengEmp?.isActive,
    roles: gautengEmp?.roles?.map(r => r.role.name)
  }));
}
main().then(() => p.$disconnect()).catch(e => { console.error(e); p.$disconnect(); });
