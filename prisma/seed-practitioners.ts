import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// South African first/last names for realistic practitioners
const ohsFirstNames = [
    "Thabo", "Lerato", "Kabelo", "Naledi", "Tshepo", "Palesa",
    "Kagiso", "Dineo", "Mpho", "Zanele", "Sizwe", "Noluthando",
    "Blessing", "Precious", "Themba", "Andile", "Busisiwe", "Lwazi",
    "Nosipho", "Sibusiso", "Thandeka", "Vusi", "Zinhle", "Ayanda",
    "Khethiwe", "Luthando", "Mbali", "Nkosana", "Ntombi", "Phila",
    "Sanele", "Thandiwe", "Unathi", "Vuyelwa", "Xolani", "Yolanda"
];
const secFirstNames = [
    "Dumisani", "Nompumelelo", "Buhle", "Lwando", "Siyabonga", "Nokuthula",
    "Mthunzi", "Refilwe", "Kgomotso", "Phindile", "Mandisa", "Thabiso",
    "Lindiwe", "Nhlanhla", "Zodwa", "Mzwandile", "Nomvula", "Simphiwe",
    "Thandolwethu", "Bonginkosi", "Khanyisile", "Mlungisi", "Nonhlanhla", "Sihle",
    "Bongiwe", "Mfundo", "Nqobile", "Sbusiso", "Thabang", "Wandile",
    "Zoleka", "Anathi", "Siphelele", "Thando", "Vuyo", "Zinzi"
];
const lastNames = [
    "Mokoena", "Ndaba", "Mahlangu", "Ngcobo", "Radebe", "Ntuli",
    "Mkhize", "Zwane", "Buthelezi", "Maseko", "Pillay", "Govender",
    "Mabaso", "Cele", "Shabalala", "Molefe", "Phiri", "Tshabalala",
    "Langa", "Gumede", "Mthethwa", "Vilakazi", "Mazibuko", "Zungu",
    "Khanyi", "Dube", "Mabena", "Motaung", "Hlongwane", "Xaba",
    "Mbatha", "Ngobese", "Mthembu", "Baloyi", "Mokgadi", "Joubert"
];

const provinces = [
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

// Province abbreviations for email addresses
const provinceAbbrev: Record<string, string> = {
    "Eastern Cape": "ec",
    "Free State": "fs",
    "Gauteng": "gp",
    "KwaZulu-Natal": "kzn",
    "Limpopo": "lp",
    "Mpumalanga": "mp",
    "Northern Cape": "nc",
    "North West": "nw",
    "Western Cape": "wc",
};

async function main() {
    console.log("🌱 Seeding OHS & Security Practitioners (4 per province)...\n");

    // Fetch provinces
    const dbProvinces = await prisma.province.findMany();
    if (dbProvinces.length === 0) {
        console.error("❌ No provinces found. Run the main seed first.");
        return;
    }

    // Fetch roles
    const ohsRole = await prisma.role.findUnique({ where: { name: "OHS_PRACTITIONER" } });
    const secRole = await prisma.role.findUnique({ where: { name: "SECURITY_PRACTITIONER" } });
    if (!ohsRole || !secRole) {
        console.error("❌ OHS_PRACTITIONER or SECURITY_PRACTITIONER role not found. Run the main seed first.");
        return;
    }

    // Fetch departments
    const ohsDept = await prisma.department.findUnique({ where: { name: "OHS" } });
    const secDept = await prisma.department.findUnique({ where: { name: "Security" } });

    let empCounter = 5000; // Start from a high number to avoid conflicts

    const ohsPractitioners: Array<{ name: string; email: string; province: string }> = [];
    const secPractitioners: Array<{ name: string; email: string; province: string }> = [];

    // ── OHS Practitioners ──
    console.log("━━━ OHS PRACTITIONERS ━━━");
    for (let pIdx = 0; pIdx < dbProvinces.length; pIdx++) {
        const province = dbProvinces.find(p => p.name === provinces[pIdx]);
        if (!province) continue;

        const abbrev = provinceAbbrev[province.name] || province.name.replace(/\s/g, "").toLowerCase().slice(0, 3);

        for (let i = 0; i < 4; i++) {
            empCounter++;
            const nameIdx = pIdx * 4 + i;
            const firstName = ohsFirstNames[nameIdx % ohsFirstNames.length];
            const lastName = lastNames[nameIdx % lastNames.length];
            const fullName = `${firstName} ${lastName}`;
            const email = `ohs.${firstName.toLowerCase()}.${lastName.toLowerCase()}.${abbrev}@dlrrd.gov.za`;
            const phone = `+27-${10 + pIdx}${i}-555-${String(empCounter).slice(-4)}`;

            const user = await prisma.user.upsert({
                where: { email },
                update: {
                    phone,
                    employeeNumber: `EMP${empCounter}`,
                    provinceId: province.id,
                    departmentId: ohsDept?.id,
                },
                create: {
                    name: fullName,
                    email,
                    phone,
                    employeeNumber: `EMP${empCounter}`,
                    provinceId: province.id,
                    departmentId: ohsDept?.id,
                },
            });

            // Assign OHS role
            try {
                await prisma.userRole.create({
                    data: { userId: user.id, roleId: ohsRole.id },
                });
            } catch (_e) {
                // unique constraint — already assigned
            }

            ohsPractitioners.push({ name: fullName, email, province: province.name });
        }
    }

    // ── Security Practitioners ──
    console.log("\n━━━ SECURITY PRACTITIONERS ━━━");
    for (let pIdx = 0; pIdx < dbProvinces.length; pIdx++) {
        const province = dbProvinces.find(p => p.name === provinces[pIdx]);
        if (!province) continue;

        const abbrev = provinceAbbrev[province.name] || province.name.replace(/\s/g, "").toLowerCase().slice(0, 3);

        for (let i = 0; i < 4; i++) {
            empCounter++;
            const nameIdx = pIdx * 4 + i;
            const firstName = secFirstNames[nameIdx % secFirstNames.length];
            const lastName = lastNames[nameIdx % lastNames.length];
            const fullName = `${firstName} ${lastName}`;
            const email = `sec.${firstName.toLowerCase()}.${lastName.toLowerCase()}.${abbrev}@dlrrd.gov.za`;
            const phone = `+27-${20 + pIdx}${i}-555-${String(empCounter).slice(-4)}`;

            const user = await prisma.user.upsert({
                where: { email },
                update: {
                    phone,
                    employeeNumber: `EMP${empCounter}`,
                    provinceId: province.id,
                    departmentId: secDept?.id,
                },
                create: {
                    name: fullName,
                    email,
                    phone,
                    employeeNumber: `EMP${empCounter}`,
                    provinceId: province.id,
                    departmentId: secDept?.id,
                },
            });

            // Assign Security role
            try {
                await prisma.userRole.create({
                    data: { userId: user.id, roleId: secRole.id },
                });
            } catch (_e) {
                // unique constraint — already assigned
            }

            secPractitioners.push({ name: fullName, email, province: province.name });
        }
    }

    // ── Print Summary ──
    console.log("\n\n╔════════════════════════════════════════════════════════════════════╗");
    console.log("║              OHS PRACTITIONERS (4 per Province)                   ║");
    console.log("╠════════════════════════════════════════════════════════════════════╣");
    let currentProv = "";
    for (const p of ohsPractitioners) {
        if (p.province !== currentProv) {
            currentProv = p.province;
            console.log(`║  📍 ${currentProv.padEnd(60)}║`);
        }
        console.log(`║    ${p.name.padEnd(28)} ${p.email.padEnd(33)}║`);
    }

    console.log("╠════════════════════════════════════════════════════════════════════╣");
    console.log("║            SECURITY PRACTITIONERS (4 per Province)               ║");
    console.log("╠════════════════════════════════════════════════════════════════════╣");
    currentProv = "";
    for (const p of secPractitioners) {
        if (p.province !== currentProv) {
            currentProv = p.province;
            console.log(`║  📍 ${currentProv.padEnd(60)}║`);
        }
        console.log(`║    ${p.name.padEnd(28)} ${p.email.padEnd(33)}║`);
    }
    console.log("╚════════════════════════════════════════════════════════════════════╝");

    console.log(`\n✅ Created ${ohsPractitioners.length} OHS Practitioners + ${secPractitioners.length} Security Practitioners = ${ohsPractitioners.length + secPractitioners.length} total`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
