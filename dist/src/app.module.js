"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const organization_module_1 = require("./organization/organization.module");
const cases_module_1 = require("./cases/cases.module");
const ohs_module_1 = require("./ohs/ohs.module");
const invoices_module_1 = require("./invoices/invoices.module");
const emergency_module_1 = require("./emergency/emergency.module");
const kpi_module_1 = require("./kpi/kpi.module");
const pdca_module_1 = require("./pdca/pdca.module");
const audit_module_1 = require("./audit/audit.module");
const sync_module_1 = require("./sync/sync.module");
const health_module_1 = require("./health/health.module");
const system_module_1 = require("./system/system.module");
const security_module_1 = require("./security/security.module");
const operations_module_1 = require("./operations/operations.module");
const notifications_module_1 = require("./notifications/notifications.module");
const forms_module_1 = require("./forms/forms.module");
const ocr_module_1 = require("./ocr.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            organization_module_1.OrganizationModule,
            cases_module_1.CasesModule,
            ohs_module_1.OhsModule,
            invoices_module_1.InvoicesModule,
            emergency_module_1.EmergencyModule,
            kpi_module_1.KpiModule,
            pdca_module_1.PdcaModule,
            audit_module_1.AuditModule,
            sync_module_1.SyncModule,
            health_module_1.HealthModule,
            system_module_1.SystemModule,
            security_module_1.SecurityModule,
            operations_module_1.OperationsModule,
            notifications_module_1.NotificationsModule,
            forms_module_1.FormsModule,
            ocr_module_1.OcrModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map