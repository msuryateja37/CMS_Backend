"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperationsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const role_enum_1 = require("../auth/enums/role.enum");
const operations_service_1 = require("./operations.service");
let OperationsController = class OperationsController {
    operations;
    constructor(operations) {
        this.operations = operations;
    }
    listEquipment() {
        return this.operations.listEquipment();
    }
    listInspections() {
        return this.operations.listInspections();
    }
    listDrills() {
        return this.operations.listDrills();
    }
    listAudits() {
        return this.operations.listAudits();
    }
    listPermits() {
        return this.operations.listPermits();
    }
};
exports.OperationsController = OperationsController;
__decorate([
    (0, common_1.Get)('equipment'),
    (0, roles_decorator_1.Roles)(role_enum_1.UserRole.EMPLOYEE, role_enum_1.UserRole.SUPERVISOR, role_enum_1.UserRole.MANAGER, role_enum_1.UserRole.SYSTEM_ADMINISTRATOR),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OperationsController.prototype, "listEquipment", null);
__decorate([
    (0, common_1.Get)('inspections'),
    (0, roles_decorator_1.Roles)(role_enum_1.UserRole.EMPLOYEE, role_enum_1.UserRole.SUPERVISOR, role_enum_1.UserRole.MANAGER, role_enum_1.UserRole.SYSTEM_ADMINISTRATOR),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OperationsController.prototype, "listInspections", null);
__decorate([
    (0, common_1.Get)('drills'),
    (0, roles_decorator_1.Roles)(role_enum_1.UserRole.EMPLOYEE, role_enum_1.UserRole.SUPERVISOR, role_enum_1.UserRole.MANAGER, role_enum_1.UserRole.SYSTEM_ADMINISTRATOR),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OperationsController.prototype, "listDrills", null);
__decorate([
    (0, common_1.Get)('audits'),
    (0, roles_decorator_1.Roles)(role_enum_1.UserRole.EMPLOYEE, role_enum_1.UserRole.SUPERVISOR, role_enum_1.UserRole.MANAGER, role_enum_1.UserRole.SYSTEM_ADMINISTRATOR),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OperationsController.prototype, "listAudits", null);
__decorate([
    (0, common_1.Get)('permits'),
    (0, roles_decorator_1.Roles)(role_enum_1.UserRole.EMPLOYEE, role_enum_1.UserRole.SUPERVISOR, role_enum_1.UserRole.MANAGER, role_enum_1.UserRole.SYSTEM_ADMINISTRATOR),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OperationsController.prototype, "listPermits", null);
exports.OperationsController = OperationsController = __decorate([
    (0, swagger_1.ApiTags)('operations'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('operations'),
    __metadata("design:paramtypes", [operations_service_1.OperationsService])
], OperationsController);
//# sourceMappingURL=operations.controller.js.map