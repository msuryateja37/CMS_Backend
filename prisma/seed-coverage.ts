/**
 * seed-coverage.ts
 * Adds the new roles (FIRST_AIDER, HR) and province coverage introduced by the
 * new case-routing flow:
 *   - 1 First Aider per province  (health cases route straight to them)
 *   - 1 HR user (releases the WCL form on escalated health cases)
 *   - ProvinceAssignment rows: one FIRST_AIDER slot per province, and one
 *     OHS_PRACTITIONER slot for each province that already has an OHS user
 *     (provinces without one stay uncovered → those pool cases go to Admin).
 *
 * Idempotent: safe to re-run. Auth is email-only (no passwords).
 */
import { PrismaClient, CoverageFunction } from '@prisma/client';

const prisma = new PrismaClient();

const slug = (name: string) => name.replace(/\s+/g, '').toLowerCase();

async function ensureRole(name: string) {
  return prisma.role.upsert({ where: { name }, update: {}, create: { name } });
}

async function ensureUserWithRole(opts: {
  name: string;
  email: string;
  employeeNumber: string;
  roleId: string;
  provinceId: string;
  departmentId?: string;
}) {
  const user = await prisma.user.upsert({
    where: { email: opts.email },
    update: { provinceId: opts.provinceId, departmentId: opts.departmentId },
    create: {
      name: opts.name,
      email: opts.email,
      employeeNumber: opts.employeeNumber,
      provinceId: opts.provinceId,
      departmentId: opts.departmentId,
    },
  });
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: user.id, roleId: opts.roleId } },
    update: {},
    create: { userId: user.id, roleId: opts.roleId },
  });
  return user;
}

async function main() {
  console.log('🌱 Seeding new roles + province coverage…');

  const firstAiderRole = await ensureRole('FIRST_AIDER');
  const hrRole = await ensureRole('HR');
  const ohsRole = await prisma.role.findUnique({ where: { name: 'OHS_PRACTITIONER' } });

  const provinces = await prisma.province.findMany({ orderBy: { name: 'asc' } });
  const healthDept = await prisma.department.findFirst({ where: { name: 'Health' } });
  const ohsDept = await prisma.department.findFirst({ where: { name: 'OHS' } });

  const created: { role: string; email: string; province: string }[] = [];

  // 1) One First Aider per province + FIRST_AIDER coverage slot.
  let n = 900;
  for (const p of provinces) {
    n++;
    const email = `firstaider.${slug(p.name)}@dlrrd.gov.za`;
    const user = await ensureUserWithRole({
      name: `First Aider ${p.name}`,
      email,
      employeeNumber: `FA${n}`,
      roleId: firstAiderRole.id,
      provinceId: p.id,
      departmentId: healthDept?.id,
    });
    await prisma.provinceAssignment.upsert({
      where: { provinceId_function: { provinceId: p.id, function: CoverageFunction.FIRST_AIDER } },
      update: { userId: user.id },
      create: { provinceId: p.id, function: CoverageFunction.FIRST_AIDER, userId: user.id },
    });
    created.push({ role: 'FIRST_AIDER', email, province: p.name });
  }

  // 2) One HR officer per province + HR coverage slot.
  let h = 900;
  for (const p of provinces) {
    h++;
    const email = `hr.${slug(p.name)}@dlrrd.gov.za`;
    const user = await ensureUserWithRole({
      name: `HR Officer ${p.name}`,
      email,
      employeeNumber: `HR${h}`,
      roleId: hrRole.id,
      provinceId: p.id,
    });
    await prisma.provinceAssignment.upsert({
      where: { provinceId_function: { provinceId: p.id, function: CoverageFunction.HR } },
      update: { userId: user.id },
      create: { provinceId: p.id, function: CoverageFunction.HR, userId: user.id },
    });
    created.push({ role: 'HR', email, province: p.name });
  }

  // 3) OHS coverage: assign the existing OHS practitioner (if any) per province.
  if (ohsRole) {
    for (const p of provinces) {
      const ohsUser = await prisma.user.findFirst({
        where: { provinceId: p.id, roles: { some: { roleId: ohsRole.id } } },
        orderBy: { createdAt: 'asc' },
      });
      if (ohsUser) {
        await prisma.provinceAssignment.upsert({
          where: { provinceId_function: { provinceId: p.id, function: CoverageFunction.OHS_PRACTITIONER } },
          update: { userId: ohsUser.id },
          create: { provinceId: p.id, function: CoverageFunction.OHS_PRACTITIONER, userId: ohsUser.id },
        });
      }
    }
  }

  console.log('\n✅ Done. New login accounts (email-only, no password):');
  for (const c of created) console.log(`   [${c.role}] ${c.email}  (${c.province})`);
  const covered = await prisma.provinceAssignment.findMany({ include: { province: true } });
  const ohsCovered = covered.filter((c) => c.function === 'OHS_PRACTITIONER').map((c) => c.province.name);
  console.log(`\n   Provinces WITH an OHS practitioner (pool handled locally): ${ohsCovered.join(', ') || 'none'}`);
  console.log('   Provinces WITHOUT OHS → their pool cases escalate to Admin.');
  if (ohsDept) { /* referenced to avoid unused warning */ }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
