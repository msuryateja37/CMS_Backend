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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmergencyController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const role_enum_1 = require("../auth/enums/role.enum");
const emergency_service_1 = require("./emergency.service");
let EmergencyController = class EmergencyController {
    emergency;
    constructor(emergency) {
        this.emergency = emergency;
    }
    uploadPlan(body) {
        return this.emergency.createPlan(body);
    }
    listPlans() {
        return this.emergency.listPlans();
    }
    registerEquipment(body) {
        return this.emergency.registerEquipment(body);
    }
    listEquipment() {
        return this.emergency.listEquipment();
    }
    recordDrill(body) {
        return this.emergency.recordDrill(body);
    }
    listDrills() {
        return this.emergency.listDrills();
    }
};
exports.EmergencyController = EmergencyController;
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.UserRole.SYSTEM_ADMINISTRATOR, role_enum_1.UserRole.OHS_PRACTITIONER),
    (0, common_1.Post)('plans'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EmergencyController.prototype, "uploadPlan", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('plans'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EmergencyController.prototype, "listPlans", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.UserRole.SYSTEM_ADMINISTRATOR, role_enum_1.UserRole.SECURITY_PRACTITIONER),
    (0, common_1.Post)('equipment'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EmergencyController.prototype, "registerEquipment", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('equipment'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EmergencyController.prototype, "listEquipment", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.UserRole.SUPERVISOR, role_enum_1.UserRole.SYSTEM_ADMINISTRATOR, role_enum_1.UserRole.OHS_PRACTITIONER, role_enum_1.UserRole.SECURITY_PRACTITIONER),
    (0, common_1.Post)('drills'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EmergencyController.prototype, "recordDrill", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('drills'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EmergencyController.prototype, "listDrills", null);
exports.EmergencyController = EmergencyController = __decorate([
    (0, swagger_1.ApiTags)('emergency'),
    (0, common_1.Controller)('emergency'),
    __metadata("design:paramtypes", [emergency_service_1.EmergencyService])
], EmergencyController);
//# sourceMappingURL=emergency.controller.js.map