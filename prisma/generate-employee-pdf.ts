import { PrismaClient } from "@prisma/client";
import PDFDocument from "pdfkit-table";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

async function main() {
    console.log("📄 Generating Categorized Employee Directory PDF...");

    try {
        const users = await prisma.user.findMany({
            where: { isActive: true, deletedAt: null },
            include: {
                roles: { include: { role: true } },
                department: true,
                province: true
            },
            orderBy: [
                { province: { name: 'asc' } },
                { name: 'asc' }
            ]
        });

        if (users.length === 0) {
            console.log("⚠️ No users found.");
            return;
        }

        const ohsPractitioners = users.filter(u => u.roles.some(r => r.role.name === 'OHS_PRACTITIONER'));
        const securityPractitioners = users.filter(u => u.roles.some(r => r.role.name === 'SECURITY_PRACTITIONER'));
        const otherStaff = users.filter(u => !u.roles.some(r => ['OHS_PRACTITIONER', 'SECURITY_PRACTITIONER'].includes(r.role.name)));

        const doc = new PDFDocument({ margin: 30, size: 'A4' });
        const filePath = path.join(__dirname, "../../employee_directory_categorized.pdf");
        doc.pipe(fs.createWriteStream(filePath));

        // Header
        doc.fontSize(18).text("Department of Land Reform and Rural Development", { align: "center" });
        doc.fontSize(14).text("Categorized Employee Directory", { align: "center" });
        doc.fontSize(10).text(`Generated: ${new Date().toLocaleString()}`, { align: "right" });
        doc.moveDown(2);

        const tableHeaders = [
            { label: "Name", property: "name", width: 120 },
            { label: "Email", property: "email", width: 210 },
            { label: "Province", property: "province", width: 90 },
            { label: "Department", property: "department", width: 90 }
        ];

        // 1. OHS Practitioners Table
        if (ohsPractitioners.length > 0) {
            await doc.table({
                title: "OHS PRACTITIONERS",
                headers: tableHeaders,
                datas: ohsPractitioners.map(u => ({
                    name: u.name,
                    email: u.email,
                    province: u.province?.name || "N/A",
                    department: u.department?.name || "N/A"
                }))
            }, {
                prepareHeader: () => doc.font("Helvetica-Bold").fontSize(10),
                prepareRow: () => doc.font("Helvetica").fontSize(9),
            });
            doc.addPage();
        }

        // 2. Security Practitioners Table
        if (securityPractitioners.length > 0) {
            await doc.table({
                title: "SECURITY PRACTITIONERS",
                headers: tableHeaders,
                datas: securityPractitioners.map(u => ({
                    name: u.name,
                    email: u.email,
                    province: u.province?.name || "N/A",
                    department: u.department?.name || "N/A"
                }))
            }, {
                prepareHeader: () => doc.font("Helvetica-Bold").fontSize(10),
                prepareRow: () => doc.font("Helvetica").fontSize(9),
            });
            doc.addPage();
        }

        // 3. General Staff Table
        if (otherStaff.length > 0) {
            await doc.table({
                title: "GENERAL STAFF & EMPLOYEES",
                headers: tableHeaders,
                datas: otherStaff.map(u => ({
                    name: u.name,
                    email: u.email,
                    province: u.province?.name || "N/A",
                    department: u.department?.name || "N/A"
                }))
            }, {
                prepareHeader: () => doc.font("Helvetica-Bold").fontSize(10),
                prepareRow: () => doc.font("Helvetica").fontSize(9),
            });
        }

        doc.end();
        console.log(`✅ PDF successfully generated at: ${filePath}`);

    } catch (error) {
        console.error("❌ Error generating PDF:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
