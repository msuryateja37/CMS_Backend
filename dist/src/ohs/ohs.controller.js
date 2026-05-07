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
exports.OhsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const role_enum_1 = require("../auth/enums/role.enum");
const ohs_service_1 = require("./ohs.service");
let OhsController = class OhsController {
    ohs;
    constructor(ohs) {
        this.ohs = ohs;
    }
    createRisk(req, body) {
        const user = req.user;
        return this.ohs.createRisk(user.sub, body);
    }
    listRisks() {
        return this.ohs.listRisks();
    }
    createJsa(req, body) {
        const user = req.user;
        return this.ohs.createJsa(user.sub, body);
    }
    scheduleInspection(body) {
        return this.ohs.scheduleInspection(body);
    }
    submitInspection(id, body) {
        return this.ohs.submitInspection(id, body);
    }
    listInspections(buildingId) {
        return this.ohs.listInspections(buildingId);
    }
    addFinding(body) {
        return this.ohs.addFinding(body);
    }
    closeFinding(id) {
        return this.ohs.closeFinding(id);
    }
    listHazards() {
        return this.ohs.listHazards();
    }
    listJsa() {
        return this.ohs.listJsa();
    }
    listSwp() {
        return this.ohs.listSwp();
    }
    getStats() {
        return this.ohs.getStats();
    }
};
exports.OhsController = OhsController;
__decorate([
    (0, roles_decorator_1.Roles)(role_enum_1.UserRole.OHS_PRACTITIONER, role_enum_1.UserRole.SYSTEM_ADMINISTRATOR),
    (0, common_1.Post)('risks'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], OhsController.prototype, "createRisk", null);
__decorate([
    (0, roles_decorator_1.Roles)(role_enum_1.UserRole.EMPLOYEE, role_enum_1.UserRole.SUPERVISOR, role_enum_1.UserRole.MANAGER, role_enum_1.UserRole.SYSTEM_ADMINISTRATOR, role_enum_1.UserRole.OHS_PRACTITIONER, role_enum_1.UserRole.FINANCE_OFFICIAL),
    (0, common_1.Get)('risks'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OhsController.prototype, "listRisks", null);
__decorate([
    (0, roles_decorator_1.Roles)(role_enum_1.UserRole.OHS_PRACTITIONER, role_enum_1.UserRole.SYSTEM_ADMINISTRATOR),
    (0, common_1.Post)('jsa'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], OhsController.prototype, "createJsa", null);
__decorate([
    (0, roles_decorator_1.Roles)(role_enum_1.UserRole.SUPERVISOR, role_enum_1.UserRole.SYSTEM_ADMINISTRATOR),
    (0, common_1.Post)('inspections'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], OhsController.prototype, "scheduleInspection", null);
__decorate([
    (0, roles_decorator_1.Roles)(role_enum_1.UserRole.OHS_PRACTITIONER, role_enum_1.UserRole.SYSTEM_ADMINISTRATOR),
    (0, common_1.Put)('inspections/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], OhsController.prototype, "submitInspection", null);
__decorate([
    (0, roles_decorator_1.Roles)(role_enum_1.UserRole.EMPLOYEE, role_enum_1.UserRole.SUPERVISOR, role_enum_1.UserRole.MANAGER, role_enum_1.UserRole.SYSTEM_ADMINISTRATOR, role_enum_1.UserRole.OHS_PRACTITIONER, role_enum_1.UserRole.FINANCE_OFFICIAL),
    (0, common_1.Get)('inspections'),
    __param(0, (0, common_1.Query)('buildingId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OhsController.prototype, "listInspections", null);
__decorate([
    (0, roles_decorator_1.Roles)(role_enum_1.UserRole.OHS_PRACTITIONER, role_enum_1.UserRole.SYSTEM_ADMINISTRATOR),
    (0, common_1.Post)('findings'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], OhsController.prototype, "addFinding", null);
__decorate([
    (0, roles_decorator_1.Roles)(role_enum_1.UserRole.SUPERVISOR, role_enum_1.UserRole.SYSTEM_ADMINISTRATOR),
    (0, common_1.Put)('findings/:id/close'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OhsController.prototype, "closeFinding", null);
__decorate([
    (0, roles_decorator_1.Roles)(role_enum_1.UserRole.EMPLOYEE, role_enum_1.UserRole.SUPERVISOR, role_enum_1.UserRole.MANAGER, role_enum_1.UserRole.OHS_PRACTITIONER, role_enum_1.UserRole.SYSTEM_ADMINISTRATOR),
    (0, common_1.Get)('hazards'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OhsController.prototype, "listHazards", null);
__decorate([
    (0, roles_decorator_1.Roles)(role_enum_1.UserRole.EMPLOYEE, role_enum_1.UserRole.SUPERVISOR, role_enum_1.UserRole.MANAGER, role_enum_1.UserRole.OHS_PRACTITIONER, role_enum_1.UserRole.SYSTEM_ADMINISTRATOR),
    (0, common_1.Get)('jsa'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OhsController.prototype, "listJsa", null);
__decorate([
    (0, roles_decorator_1.Roles)(role_enum_1.UserRole.EMPLOYEE, role_enum_1.UserRole.SUPERVISOR, role_enum_1.UserRole.MANAGER, role_enum_1.UserRole.OHS_PRACTITIONER, role_enum_1.UserRole.SYSTEM_ADMINISTRATOR),
    (0, common_1.Get)('swp'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OhsController.prototype, "listSwp", null);
__decorate([
    (0, roles_decorator_1.Roles)(role_enum_1.UserRole.EMPLOYEE, role_enum_1.UserRole.SUPERVISOR, role_enum_1.UserRole.MANAGER, role_enum_1.UserRole.OHS_PRACTITIONER, role_enum_1.UserRole.SYSTEM_ADMINISTRATOR),
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OhsController.prototype, "getStats", null);
exports.OhsController = OhsController = __decorate([
    (0, swagger_1.ApiTags)('ohs'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('ohs'),
    __metadata("design:paramtypes", [ohs_service_1.OhsService])
], OhsController);
//# sourceMappingURL=ohs.controller.js.map