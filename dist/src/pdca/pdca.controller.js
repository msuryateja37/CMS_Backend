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
exports.PdcaController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const role_enum_1 = require("../auth/enums/role.enum");
const pdca_service_1 = require("./pdca.service");
let PdcaController = class PdcaController {
    pdca;
    constructor(pdca) {
        this.pdca = pdca;
    }
    create(body) {
        return this.pdca.create(body);
    }
    update(id, body) {
        return this.pdca.update(id, body);
    }
    list() {
        return this.pdca.list();
    }
};
exports.PdcaController = PdcaController;
__decorate([
    (0, roles_decorator_1.Roles)(role_enum_1.UserRole.MANAGER, role_enum_1.UserRole.SYSTEM_ADMINISTRATOR),
    (0, common_1.Post)('actions'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PdcaController.prototype, "create", null);
__decorate([
    (0, roles_decorator_1.Roles)(role_enum_1.UserRole.MANAGER, role_enum_1.UserRole.SYSTEM_ADMINISTRATOR),
    (0, common_1.Put)('actions/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PdcaController.prototype, "update", null);
__decorate([
    (0, roles_decorator_1.Roles)(role_enum_1.UserRole.EMPLOYEE, role_enum_1.UserRole.SUPERVISOR, role_enum_1.UserRole.MANAGER, role_enum_1.UserRole.SYSTEM_ADMINISTRATOR, role_enum_1.UserRole.OHS_PRACTITIONER, role_enum_1.UserRole.FINANCE_OFFICIAL),
    (0, common_1.Get)('actions'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PdcaController.prototype, "list", null);
exports.PdcaController = PdcaController = __decorate([
    (0, swagger_1.ApiTags)('pdca'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('pdca'),
    __metadata("design:paramtypes", [pdca_service_1.PdcaService])
], PdcaController);
//# sourceMappingURL=pdca.controller.js.map