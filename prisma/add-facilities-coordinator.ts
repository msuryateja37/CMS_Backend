import { PrismaClient } from "@prisma/client";

/**
 * Additive, idempotent script.
 *
 * Adds the FACILITIES_COORDINATOR role and one Facilities Co Coordinator SSO
 * user per province (facilitiescoordinator.<province>@dlrrd.gov.za) so the
 * "Log in with Microsoft" -> Facilities Co Coordinator account resolves.
 *
 * Unlike prisma/seed.ts, this DOES NOT wipe any existing data — safe to run
 * against a shared database. Re-running it is a no-op.
 *
 * Run with:  npx ts-node prisma/add-facilities-coordinator.ts
 */
const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Ensuring FACILITIES_COORDINATOR role + provincial users exist...");

    // 1. Ensure the role exists
    let role = await prisma.role.findFirst({ where: { name: "FACILITIES_COORDINATOR" } });
    if (!role) {
        role = await prisma.role.create({ data: { name: "FACILITIES_COORDINATOR" } });
        console.log("✅ Created FACILITIES_COORDINATOR role.");
    } else {
        console.log("ℹ️  FACILITIES_COORDINATOR role already present.");
    }

    // 2. Resolve the Facilities department (optional link)
    const facilitiesDept = await prisma.department.findFirst({
        where: { name: "Facilities" },
    });

    // 3. One coordinator per province
    const provinces = await prisma.province.findMany();
    if (provinces.length === 0) {
        throw new Error("No provinces found — run the main seed first.");
    }

    let created = 0;
    let empSeq = 3200;
    for (const province of provinces) {
        const slug = province.name.replace(/\s+/g, "").toLowerCase();
        const email = `facilitiescoordinator.${slug}@dlrrd.gov.za`;

        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            user = await prisma.user.create({
                data: {
                    name: `${province.name} Facilities Co Coordinator`,
                    email,
                    phone: "+27-11-555-0120",
                    employeeNumber: `EMP${empSeq++}`,
                    provinceId: province.id,
                    departmentId: facilitiesDept?.id ?? null,
                    isActive: true,
                },
            });
            created += 1;
        }

        const existingLink = await prisma.userRole.findFirst({
            where: { userId: user.id, roleId: role.id },
        });
        if (!existingLink) {
            await prisma.userRole.create({
                data: { userId: user.id, roleId: role.id },
            });
        }
    }

    console.log(`✅ Ensured ${provinces.length} coordinator users (${created} newly created).`);
    console.log("🎉 Done.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
