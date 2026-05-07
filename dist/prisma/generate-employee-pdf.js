"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const pdfkit_table_1 = __importDefault(require("pdfkit-table"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const prisma = new client_1.PrismaClient();
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
        const doc = new pdfkit_table_1.default({ margin: 30, size: 'A4' });
        const filePath = path.join(__dirname, "../../employee_directory_categorized.pdf");
        doc.pipe(fs.createWriteStream(filePath));
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
    }
    catch (error) {
        console.error("❌ Error generating PDF:", error);
    }
    finally {
        await prisma.$disconnect();
    }
}
main();
//# sourceMappingURL=generate-employee-pdf.js.map