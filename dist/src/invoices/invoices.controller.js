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
exports.InvoicesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const role_enum_1 = require("../auth/enums/role.enum");
const invoices_service_1 = require("./invoices.service");
let InvoicesController = class InvoicesController {
    invoices;
    constructor(invoices) {
        this.invoices = invoices;
    }
    create(body) {
        return this.invoices.create(body);
    }
    list(status) {
        return this.invoices.list(status);
    }
    get(id) {
        return this.invoices.getById(id);
    }
    approve(req, id) {
        const user = req.user;
        return this.invoices.transition(id, 'APPROVED', user.sub);
    }
    reject(req, id, body) {
        const user = req.user;
        return this.invoices.transition(id, 'REJECTED', user.sub, body?.reason);
    }
    actions(id) {
        return this.invoices.actions(id);
    }
    finalize(req, id) {
        const user = req.user;
        return this.invoices.transition(id, 'COMPLETED', user.sub);
    }
};
exports.InvoicesController = InvoicesController;
__decorate([
    (0, roles_decorator_1.Roles)(role_enum_1.UserRole.FINANCE_OFFICIAL, role_enum_1.UserRole.SYSTEM_ADMINISTRATOR),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InvoicesController.prototype, "create", null);
__decorate([
    (0, roles_decorator_1.Roles)(role_enum_1.UserRole.FINANCE_OFFICIAL, role_enum_1.UserRole.SYSTEM_ADMINISTRATOR),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InvoicesController.prototype, "list", null);
__decorate([
    (0, roles_decorator_1.Roles)(role_enum_1.UserRole.FINANCE_OFFICIAL, role_enum_1.UserRole.SYSTEM_ADMINISTRATOR),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InvoicesController.prototype, "get", null);
__decorate([
    (0, roles_decorator_1.Roles)(role_enum_1.UserRole.SUPERVISOR, role_enum_1.UserRole.SYSTEM_ADMINISTRATOR),
    (0, common_1.Put)(':id/approve'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], InvoicesController.prototype, "approve", null);
__decorate([
    (0, roles_decorator_1.Roles)(role_enum_1.UserRole.SUPERVISOR, role_enum_1.UserRole.SYSTEM_ADMINISTRATOR),
    (0, common_1.Put)(':id/reject'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], InvoicesController.prototype, "reject", null);
__decorate([
    (0, roles_decorator_1.Roles)(role_enum_1.UserRole.FINANCE_OFFICIAL, role_enum_1.UserRole.SYSTEM_ADMINISTRATOR),
    (0, common_1.Get)(':id/actions'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InvoicesController.prototype, "actions", null);
__decorate([
    (0, roles_decorator_1.Roles)(role_enum_1.UserRole.MANAGER, role_enum_1.UserRole.SYSTEM_ADMINISTRATOR),
    (0, common_1.Put)(':id/finalize'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], InvoicesController.prototype, "finalize", null);
exports.InvoicesController = InvoicesController = __decorate([
    (0, swagger_1.ApiTags)('invoices'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('invoices'),
    __metadata("design:paramtypes", [invoices_service_1.InvoicesService])
], InvoicesController);
//# sourceMappingURL=invoices.controller.js.map