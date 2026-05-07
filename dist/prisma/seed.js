"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log("🌱 Seeding database...");
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
    ];
    const provinces = [];
    for (const name of provincesList) {
        const province = await prisma.province.upsert({
            where: { name },
            update: {},
            create: { name },
        });
        provinces.push(province);
    }
    const departmentsList = [
        "IT",
        "OHS",
        "Water",
        "Electrical",
        "Security",
        "Health",
        "Facilities",
    ];
    const departments = [];
    for (const name of departmentsList) {
        const dept = await prisma.department.upsert({
            where: { name },
            update: {},
            create: { name },
        });
        departments.push(dept);
    }
    const rolesData = [
        "SUPERVISOR",
        "MANAGER",
        "OHS_PRACTITIONER",
        "EMPLOYEE",
        "FINANCE_OFFICIAL",
        "SYSTEM_ADMINISTRATOR",
        "SECURITY_PRACTITIONER",
    ];
    const roles = {};
    for (const roleName of rolesData) {
        const role = await prisma.role.upsert({
            where: { name: roleName },
            update: {},
            create: { name: roleName },
        });
        roles[roleName] = role;
    }
    const coreUsers = [
        {
            name: "Main Supervisor",
            email: "supervisor@dlrrd.gov.za",
            role: "SUPERVISOR",
            phone: "+27-11-555-0001",
            employeeNumber: "EMP001",
        },
        {
            name: "Main Manager",
            email: "manager@dlrrd.gov.za",
            role: "MANAGER",
            phone: "+27-11-555-0002",
            employeeNumber: "EMP002",
        },
        {
            name: "OHS Practitioner",
            email: "ohs.practitioner@dlrrd.gov.za",
            role: "OHS_PRACTITIONER",
            phone: "+27-11-555-0003",
            employeeNumber: "EMP003",
        },
        {
            name: "General Employee",
            email: "employee@dlrrd.gov.za",
            role: "EMPLOYEE",
            phone: "+27-11-555-0004",
            employeeNumber: "EMP004",
        },
        {
            name: "Finance Officer",
            email: "finance@dlrrd.gov.za",
            role: "FINANCE_OFFICIAL",
            phone: "+27-11-555-0005",
            employeeNumber: "EMP005",
        },
        {
            name: "System Admin",
            email: "admin@dlrrd.gov.za",
            role: "SYSTEM_ADMINISTRATOR",
            phone: "+27-11-555-0006",
            employeeNumber: "EMP006",
        },
        {
            name: "Security Practitioner",
            email: "security.practitioner@dlrrd.gov.za",
            role: "SECURITY_PRACTITIONER",
            phone: "+27-11-555-0007",
            employeeNumber: "EMP007",
        },
        {
            name: "Thandi Nkosi",
            email: "thandi.nkosi@dlrrd.gov.za",
            role: "OHS_PRACTITIONER",
            phone: "+27-11-555-0010",
            employeeNumber: "EMP010",
        },
        {
            name: "Sipho Dlamini",
            email: "sipho.dlamini@dlrrd.gov.za",
            role: "OHS_PRACTITIONER",
            phone: "+27-11-555-0011",
            employeeNumber: "EMP011",
        },
        {
            name: "Nomsa Mthembu",
            email: "nomsa.mthembu@dlrrd.gov.za",
            role: "OHS_PRACTITIONER",
            phone: "+27-11-555-0012",
            employeeNumber: "EMP012",
        },
        {
            name: "Bongani Zulu",
            email: "bongani.zulu@dlrrd.gov.za",
            role: "SECURITY_PRACTITIONER",
            phone: "+27-11-555-0013",
            employeeNumber: "EMP013",
        },
        {
            name: "Lindiwe Khumalo",
            email: "lindiwe.khumalo@dlrrd.gov.za",
            role: "SECURITY_PRACTITIONER",
            phone: "+27-11-555-0014",
            employeeNumber: "EMP014",
        },
        {
            name: "Mandla Sithole",
            email: "mandla.sithole@dlrrd.gov.za",
            role: "SECURITY_PRACTITIONER",
            phone: "+27-11-555-0015",
            employeeNumber: "EMP015",
        },
    ];
    let coreUserIndex = 0;
    for (const userData of coreUsers) {
        coreUserIndex++;
        const randomDaysAgo = Math.floor(Math.random() * 30);
        const lastLogin = new Date();
        lastLogin.setDate(lastLogin.getDate() - randomDaysAgo);
        let departmentId = undefined;
        let provinceId = undefined;
        if (userData.role === 'OHS_PRACTITIONER') {
            departmentId = departments[1]?.id;
            const ohsProvinceMap = {
                'ohs.practitioner@dlrrd.gov.za': 0,
                'thandi.nkosi@dlrrd.gov.za': 2,
                'sipho.dlamini@dlrrd.gov.za': 3,
                'nomsa.mthembu@dlrrd.gov.za': 8,
            };
            provinceId = provinces[ohsProvinceMap[userData.email] ?? 0]?.id;
        }
        else if (userData.role === 'SECURITY_PRACTITIONER') {
            departmentId = departments[4]?.id;
            const secProvinceMap = {
                'security.practitioner@dlrrd.gov.za': 0,
                'bongani.zulu@dlrrd.gov.za': 2,
                'lindiwe.khumalo@dlrrd.gov.za': 3,
                'mandla.sithole@dlrrd.gov.za': 8,
            };
            provinceId = provinces[secProvinceMap[userData.email] ?? 0]?.id;
        }
        const user = await prisma.user.upsert({
            where: { email: userData.email },
            update: {
                phone: userData.phone,
                employeeNumber: userData.employeeNumber,
                lastLoginAt: lastLogin,
                departmentId: departmentId,
                provinceId: provinceId,
            },
            create: {
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                employeeNumber: userData.employeeNumber,
                lastLoginAt: lastLogin,
                departmentId: departmentId,
                provinceId: provinceId,
            },
        });
        try {
            await prisma.userRole.create({
                data: {
                    userId: user.id,
                    roleId: roles[userData.role].id,
                },
            });
        }
        catch (e) {
        }
    }
    const buildingNames = [
        'Regional Office',
        'Service Center',
        'Administrative Building',
        'Operations Hub'
    ];
    for (const province of provinces) {
        const numBuildings = 3 + Math.floor(Math.random() * 2);
        for (let i = 0; i < numBuildings; i++) {
            const buildingName = `${province.name} ${buildingNames[i]}`;
            await prisma.building.create({
                data: {
                    name: buildingName,
                    address: `${i + 1} ${['Main', 'Oak', 'Park', 'Central'][i]} Street, ${province.name}`,
                    postalCode: `${Math.floor(1000 + Math.random() * 9000)}`,
                    provinceId: province.id,
                    latitude: -30 + Math.random() * 5,
                    longitude: 25 + Math.random() * 5,
                },
            });
        }
    }
    const gautengBuildings = await prisma.building.findMany({
        where: { province: { name: 'Gauteng' } },
        take: 7,
    });
    for (let i = 0; i < departments.length; i++) {
        const building = gautengBuildings[i % gautengBuildings.length];
        if (building) {
            await prisma.department.update({
                where: { id: departments[i].id },
                data: { buildingId: building.id },
            });
        }
    }
    console.log("✅ Departments linked to Gauteng buildings");
    let employeeCounter = 1000;
    for (const province of provinces) {
        for (const dept of departments) {
            for (let i = 1; i <= 4; i++) {
                employeeCounter++;
                const email = `${dept.name.toLowerCase()}_${i}_${province.name
                    .replace(/\s/g, "")
                    .toLowerCase()}@dlrrd.gov.za`;
                const phoneNumber = `+27-${Math.floor(10 + Math.random() * 89)}-${Math.floor(100 + Math.random() * 899)}-${Math.floor(1000 + Math.random() * 8999)}`;
                const hasLoggedIn = Math.random() > 0.5;
                const randomDaysAgo = Math.floor(Math.random() * 60);
                const lastLogin = new Date();
                lastLogin.setDate(lastLogin.getDate() - randomDaysAgo);
                const user = await prisma.user.upsert({
                    where: { email },
                    update: {
                        phone: phoneNumber,
                        employeeNumber: `EMP${employeeCounter}`,
                        lastLoginAt: hasLoggedIn ? lastLogin : null,
                    },
                    create: {
                        name: `${dept.name} Staff ${i} - ${province.name}`,
                        email: email,
                        phone: phoneNumber,
                        employeeNumber: `EMP${employeeCounter}`,
                        departmentId: dept.id,
                        provinceId: province.id,
                        lastLoginAt: hasLoggedIn ? lastLogin : null,
                    }
                });
                try {
                    await prisma.userRole.create({
                        data: {
                            userId: user.id,
                            roleId: roles["EMPLOYEE"].id,
                        },
                    });
                }
                catch (e) {
                }
            }
        }
    }
    console.log("✅ Seeding completed successfully!");
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map