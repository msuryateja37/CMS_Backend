import { PrismaClient } from "@prisma/client";

/**
 * Additive, idempotent script.
 *
 * Adds the CHIEF_DIRECTOR role and a single National Office Chief Director
 * SSO user (chiefdirector.nationaloffice@dlrrd.gov.za) so the "Log in with
 * Microsoft" → Chief Director account resolves.
 *
 * Unlike prisma/seed.ts, this DOES NOT wipe any existing data — safe to run
 * against a shared database. Re-running it is a no-op.
 *
 * Run with:  npx ts-node prisma/add-chief-director.ts
 */
const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Ensuring CHIEF_DIRECTOR role + National Office user exist...");

    // 1. Ensure the role exists
    let role = await prisma.role.findFirst({ where: { name: "CHIEF_DIRECTOR" } });
    if (!role) {
        role = await prisma.role.create({ data: { name: "CHIEF_DIRECTOR" } });
        console.log("✅ Created CHIEF_DIRECTOR role.");
    } else {
        console.log("ℹ️  CHIEF_DIRECTOR role already present.");
    }

    // 2. Resolve the National Office province
    const nationalOffice = await prisma.province.findFirst({
        where: { name: "National Office" },
    });
    if (!nationalOffice) {
        throw new Error(
            "National Office province not found — run the main seed first.",
        );
    }

    // 3. Ensure the Chief Director user exists
    const email = "chiefdirector.nationaloffice@dlrrd.gov.za";
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        user = await prisma.user.create({
            data: {
                name: "National Office Chief Director",
                email,
                phone: "+27-12-555-0110",
                employeeNumber: "EMP2098",
                provinceId: nationalOffice.id,
                isActive: true,
            },
        });
        console.log(`✅ Created user ${email}.`);
    } else {
        console.log(`ℹ️  User ${email} already present.`);
    }

    // 4. Ensure the user↔role link exists
    const existingLink = await prisma.userRole.findFirst({
        where: { userId: user.id, roleId: role.id },
    });
    if (!existingLink) {
        await prisma.userRole.create({
            data: { userId: user.id, roleId: role.id },
        });
        console.log("✅ Linked user to CHIEF_DIRECTOR role.");
    } else {
        console.log("ℹ️  User already linked to CHIEF_DIRECTOR role.");
    }

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
