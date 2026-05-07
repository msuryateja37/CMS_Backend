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
exports.SecurityController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const role_enum_1 = require("../auth/enums/role.enum");
const security_service_1 = require("./security.service");
let SecurityController = class SecurityController {
    security;
    constructor(security) {
        this.security = security;
    }
    getStats() {
        return this.security.getStats();
    }
    getIncidents() {
        return this.security.getIncidents();
    }
    getTrends() {
        return this.security.getIncidentTrends();
    }
    getSeverity() {
        return this.security.getSeverityDistribution();
    }
    createIncident(body) {
        return this.security.createIncident(body);
    }
};
exports.SecurityController = SecurityController;
__decorate([
    (0, roles_decorator_1.Roles)(role_enum_1.UserRole.SECURITY_PRACTITIONER, role_enum_1.UserRole.SYSTEM_ADMINISTRATOR),
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SecurityController.prototype, "getStats", null);
__decorate([
    (0, roles_decorator_1.Roles)(role_enum_1.UserRole.SECURITY_PRACTITIONER, role_enum_1.UserRole.SYSTEM_ADMINISTRATOR),
    (0, common_1.Get)('incidents'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SecurityController.prototype, "getIncidents", null);
__decorate([
    (0, roles_decorator_1.Roles)(role_enum_1.UserRole.SECURITY_PRACTITIONER, role_enum_1.UserRole.SYSTEM_ADMINISTRATOR),
    (0, common_1.Get)('charts/trends'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SecurityController.prototype, "getTrends", null);
__decorate([
    (0, roles_decorator_1.Roles)(role_enum_1.UserRole.SECURITY_PRACTITIONER, role_enum_1.UserRole.SYSTEM_ADMINISTRATOR),
    (0, common_1.Get)('charts/severity'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SecurityController.prototype, "getSeverity", null);
__decorate([
    (0, roles_decorator_1.Roles)(role_enum_1.UserRole.SECURITY_PRACTITIONER, role_enum_1.UserRole.SYSTEM_ADMINISTRATOR),
    (0, common_1.Post)('incidents'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SecurityController.prototype, "createIncident", null);
exports.SecurityController = SecurityController = __decorate([
    (0, swagger_1.ApiTags)('security'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('security'),
    __metadata("design:paramtypes", [security_service_1.SecurityService])
], SecurityController);
//# sourceMappingURL=security.controller.js.map