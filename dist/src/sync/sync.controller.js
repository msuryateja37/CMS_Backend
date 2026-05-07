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
exports.SyncController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const sync_service_1 = require("./sync.service");
const role_enum_1 = require("../auth/enums/role.enum");
let SyncController = class SyncController {
    sync;
    constructor(sync) {
        this.sync = sync;
    }
    push(req, body) {
        const user = req.user;
        return this.sync.push(user.sub, body);
    }
    pull(since) {
        return this.sync.pull(since);
    }
    resolve(body) {
        return this.sync.resolve(body);
    }
};
exports.SyncController = SyncController;
__decorate([
    (0, roles_decorator_1.Roles)(role_enum_1.UserRole.EMPLOYEE, role_enum_1.UserRole.SUPERVISOR, role_enum_1.UserRole.MANAGER, role_enum_1.UserRole.SYSTEM_ADMINISTRATOR, role_enum_1.UserRole.OHS_PRACTITIONER, role_enum_1.UserRole.FINANCE_OFFICIAL),
    (0, common_1.Post)('push'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], SyncController.prototype, "push", null);
__decorate([
    (0, roles_decorator_1.Roles)(role_enum_1.UserRole.EMPLOYEE, role_enum_1.UserRole.SUPERVISOR, role_enum_1.UserRole.MANAGER, role_enum_1.UserRole.SYSTEM_ADMINISTRATOR, role_enum_1.UserRole.OHS_PRACTITIONER, role_enum_1.UserRole.FINANCE_OFFICIAL),
    (0, common_1.Get)('pull'),
    __param(0, (0, common_1.Query)('since')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SyncController.prototype, "pull", null);
__decorate([
    (0, roles_decorator_1.Roles)(role_enum_1.UserRole.SYSTEM_ADMINISTRATOR),
    (0, common_1.Post)('resolve'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SyncController.prototype, "resolve", null);
exports.SyncController = SyncController = __decorate([
    (0, swagger_1.ApiTags)('sync'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('sync'),
    __metadata("design:paramtypes", [sync_service_1.SyncService])
], SyncController);
//# sourceMappingURL=sync.controller.js.map