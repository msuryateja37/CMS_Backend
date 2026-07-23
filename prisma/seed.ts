import { PrismaClient, Province, Department, CoverageFunction } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding database...");

    // 1. Wipe old database records
    console.log("🧹 Wiping old database records...");
    try { await prisma.investigation.deleteMany(); } catch (e) {}
    try { await prisma.invoice.deleteMany(); } catch (e) {}
    try { await prisma.incidentAssignment.deleteMany(); } catch (e) {}
    try { await prisma.incidentMedia.deleteMany(); } catch (e) {}
    try { await prisma.incidentComment.deleteMany(); } catch (e) {}
    try { await prisma.incidentStatusLog.deleteMany(); } catch (e) {}
    try { await prisma.correctiveAction.deleteMany(); } catch (e) {}
    try { await prisma.approvalAttachment.deleteMany(); } catch (e) {}
    try { await prisma.approval.deleteMany(); } catch (e) {}
    try { await prisma.incidentSLATracking.deleteMany(); } catch (e) {}
    try { await prisma.impactedPerson.deleteMany(); } catch (e) {}
    try { await prisma.annexureOne.deleteMany(); } catch (e) {}
    try { await prisma.incident.deleteMany(); } catch (e) {}
    try { await prisma.provinceAssignment.deleteMany(); } catch (e) {}
    try { await prisma.notification.deleteMany(); } catch (e) {}
    try { await prisma.userRole.deleteMany(); } catch (e) {}
    try { await prisma.user.deleteMany(); } catch (e) {}
    try { await prisma.department.deleteMany(); } catch (e) {}
    try { await prisma.building.deleteMany(); } catch (e) {}
    try { await prisma.rolePermission.deleteMany(); } catch (e) {}
    try { await prisma.permission.deleteMany(); } catch (e) {}
    try { await prisma.role.deleteMany(); } catch (e) {}
    try { await prisma.province.deleteMany(); } catch (e) {}
    console.log("✅ Wiped successfully!");

    // 2. Create Provinces
    const provincesList = [
        "Eastern Cape",
        "Free State",
        "Gauteng",
        "KwaZulu-Natal",
        "Limpopo",
        "Mpumalanga",
        "Northern Cape",
        "North West",
        "Western Cape",
        "National Office",
    ];

    const provinces: Province[] = [];
    for (const name of provincesList) {
        const province = await prisma.province.create({
            data: { name },
        });
        provinces.push(province);
    }
    console.log(`✅ Seeded ${provinces.length} provinces.`);

    // 3. Create Departments
    const departmentsList = [
        "IT",
        "OHS",
        "Water",
        "Electrical",
        "Security",
        "Health",
        "Facilities",
    ];

    const departments: Department[] = [];
    for (const name of departmentsList) {
        const dept = await prisma.department.create({
            data: { name },
        });
        departments.push(dept);
    }
    console.log(`✅ Seeded ${departments.length} departments.`);

    // 4. Create Roles
    const rolesData = [
        "SUPERVISOR",
        "MANAGER",
        "OHS_PRACTITIONER",
        "OHS_NATIONAL_OFFICE",
        "EMPLOYEE",
        "FINANCE_OFFICIAL",
        "SYSTEM_ADMINISTRATOR",
        "FIRST_AIDER",
        "HR",
        "PSSC_COORDINATOR",
        "DEPUTY_DIRECTOR",
        "CHIEF_DIRECTOR",
    ];

    const roles: any = {};
    for (const roleName of rolesData) {
        const role = await prisma.role.create({
            data: { name: roleName },
        });
        roles[roleName] = role;
    }
    console.log("✅ Seeded roles.");

    // 5. Create 2 or 3 buildings per province
    const buildingNames = [
        'Regional Office',
        'Service Center',
        'Administrative Building'
    ];

    for (const province of provinces) {
        const numBuildings = 2 + Math.floor(Math.random() * 2); // 2 or 3 buildings
        for (let i = 0; i < numBuildings; i++) {
            const buildingName = `${province.name} ${buildingNames[i]}`;
            const b = await prisma.building.create({
                data: {
                    name: buildingName,
                    address: `${i + 1} ${['Main', 'Oak', 'Park'][i]} Street, ${province.name}`,
                    postalCode: `${Math.floor(1000 + Math.random() * 9000)}`,
                    provinceId: province.id,
                    latitude: -30 + Math.random() * 5,
                    longitude: 25 + Math.random() * 5,
                },
            });
            
            // Link some departments to this building
            if (province.name === 'Gauteng') {
                const dept = departments[i % departments.length];
                await prisma.department.update({
                    where: { id: dept.id },
                    data: { buildingId: b.id },
                });
            }
        }
    }
    console.log("✅ Seeded buildings (2-3 per province) and linked departments.");

    // 6. Seed only the SSO users
    console.log("👥 Seeding SSO users...");
    let empNumCounter = 1001;

    for (const province of provinces) {
        const slug = province.name.replace(/\s+/g, '').toLowerCase();
        
        const ssoRoles = [
            { role: "EMPLOYEE", prefix: "employee" },
            { role: "SUPERVISOR", prefix: "supervisor" },
            { role: "FIRST_AIDER", prefix: "firstaider" },
            { role: "HR", prefix: "hr" },
            { role: "PSSC_COORDINATOR", prefix: "pssccoordinator" },
            { role: "DEPUTY_DIRECTOR", prefix: "deputydirector" },
        ];

        if (province.name === 'National Office') {
            ssoRoles.push({ role: "OHS_NATIONAL_OFFICE", prefix: "ohspractitioner" });
            ssoRoles.push({ role: "CHIEF_DIRECTOR", prefix: "chiefdirector" });
        } else if (!['Eastern Cape', 'Northern Cape', 'North West'].includes(province.name)) {
            ssoRoles.push({ role: "OHS_PRACTITIONER", prefix: "ohspractitioner" });
        }

        for (const item of ssoRoles) {
            const email = `${item.prefix}.${slug}@dlrrd.gov.za`;
            const name = `${province.name} ${item.role.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}`;

            let departmentId: string | null = null;
            if (item.role === 'OHS_PRACTITIONER' || item.role === 'OHS_NATIONAL_OFFICE') {
                departmentId = departments.find(d => d.name === 'OHS')?.id || departments[0].id;
            } else if (item.role === 'FIRST_AIDER') {
                departmentId = departments.find(d => d.name === 'Security')?.id || departments[0].id;
            } else if (item.role === 'HR') {
                departmentId = departments.find(d => d.name === 'Health')?.id || departments[0].id;
            } else {
                departmentId = departments[Math.floor(Math.random() * departments.length)].id;
            }

            const user = await prisma.user.create({
                data: {
                    name,
                    email,
                    phone: `+27-${Math.floor(10 + Math.random() * 89)}-${Math.floor(100 + Math.random() * 899)}-${Math.floor(1000 + Math.random() * 8999)}`,
                    employeeNumber: `EMP${empNumCounter++}`,
                    provinceId: province.id,
                    departmentId,
                    isActive: true,
                }
            });

            await prisma.userRole.create({
                data: {
                    userId: user.id,
                    roleId: roles[item.role].id,
                }
            });

            if (item.role === 'FIRST_AIDER') {
                await prisma.provinceAssignment.create({
                    data: {
                        provinceId: province.id,
                        function: CoverageFunction.FIRST_AIDER,
                        userId: user.id,
                    }
                });
            } else if (item.role === 'OHS_PRACTITIONER') {
                await prisma.provinceAssignment.create({
                    data: {
                        provinceId: province.id,
                        function: CoverageFunction.OHS_PRACTITIONER,
                        userId: user.id,
                    }
                });
            }
        }
    }

    // Seed global Administrator & Manager
    const extraUsers = [
        { name: "System Admin", email: "admin@dlrrd.gov.za", role: "SYSTEM_ADMINISTRATOR" },
        { name: "Main Manager", email: "manager@dlrrd.gov.za", role: "MANAGER" },
        { name: "Finance Officer", email: "finance@dlrrd.gov.za", role: "FINANCE_OFFICIAL" },
    ];

    for (const item of extraUsers) {
        const user = await prisma.user.create({
            data: {
                name: item.name,
                email: item.email,
                phone: `+27-11-555-0099`,
                employeeNumber: `EMP${empNumCounter++}`,
                isActive: true,
            }
        });

        await prisma.userRole.create({
            data: {
                userId: user.id,
                roleId: roles[item.role].id,
            }
        });
    }

    console.log("✅ Successfully seeded all SSO users!");
    console.log("🌱 Seeding completed successfully!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
