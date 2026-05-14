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
exports.CasesController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const role_enum_1 = require("../auth/enums/role.enum");
const cases_service_1 = require("./cases.service");
const storage_service_1 = require("../system/storage.service");
let CasesController = class CasesController {
    cases;
    storage;
    constructor(cases, storage) {
        this.cases = cases;
        this.storage = storage;
    }
    async uploadFile(file, incidentId) {
        const url = await this.storage.uploadFile(file, incidentId || 'evidence');
        return {
            url,
            name: file.originalname,
            size: file.size,
            type: file.mimetype,
        };
    }
    async create(req, body) {
        const user = req.user;
        return this.cases.create(user.sub, body);
    }
    async list(query) {
        return this.cases.list(query);
    }
    async getKpiMetrics() {
        return this.cases.getKpiMetrics();
    }
    async categories() {
        return this.cases.listCategories();
    }
    async getEmployeeStats(req) {
        const user = req.user;
        return this.cases.getEmployeeStats(user.sub);
    }
    async getUpcomingHearings(req) {
        const user = req.user;
        return this.cases.getUpcomingHearings(user.sub);
    }
    async createCategory(body) {
        return this.cases.createCategory(body);
    }
    async updateCategory(id, body) {
        return this.cases.updateCategory(id, body);
    }
    async deleteCategory(id) {
        return this.cases.deleteCategory(id);
    }
    async getSlaTracking() {
        return this.cases.getSlaTracking();
    }
    async get(id) {
        return this.cases.getById(id);
    }
    async update(req, id, body) {
        const user = req.user;
        return this.cases.update(id, body, user.sub);
    }
    async assign(req, id, body) {
        const user = req.user;
        return this.cases.assign(id, body.assignedToId, user.sub);
    }
    async updateStatus(req, id, body) {
        const user = req.user;
        return this.cases.updateStatus(id, body.status, user.sub);
    }
    async escalate(req, id, body) {
        const user = req.user;
        return this.cases.escalate(id, user.sub, body);
    }
    async uploadEvidence(req, id, body) {
        const user = req.user;
        return this.cases.addEvidence(id, user.sub, body);
    }
    async listEvidence(id) {
        return this.cases.listEvidence(id);
    }
    async addCorrectiveAction(id, body) {
        return this.cases.addCorrectiveAction(id, body.actionText);
    }
    async patchCorrectiveAction(id, actionId, body) {
        return this.cases.updateCorrectiveAction(id, actionId, body);
    }
    async addApproval(req, id, body) {
        const user = req.user;
        return this.cases.addApproval(id, body, user.sub);
    }
    async putApproval(id, approvalId, body) {
        return this.cases.updateApproval(id, approvalId, body);
    }
    async postApprovalAttachment(id, approvalId, body) {
        return this.cases.addApprovalAttachment(id, approvalId, body);
    }
    async deleteApprovalAttachment(id, approvalId, attachmentId) {
        return this.cases.deleteApprovalAttachment(id, approvalId, attachmentId);
    }
    async deleteApproval(id, approvalId) {
        return this.cases.deleteApproval(id, approvalId);
    }
    async createEscalationConfig(id, body) {
        return this.cases.createEscalationConfig(id, body);
    }
    async getEscalationConfig(id) {
        return this.cases.getEscalationConfig(id);
    }
    async updateEscalationConfig(id, body) {
        return this.cases.updateEscalationConfig(id, body);
    }
    async addComment(req, id, body) {
        const user = req.user;
        return this.cases.addComment(id, user.sub, body.comment);
    }
    async getComments(id) {
        return this.cases.getComments(id);
    }
    async getActivityTimeline(id) {
        return this.cases.getActivityTimeline(id);
    }
    async addActivity(req, id, body) {
        const user = req.user;
        return this.cases.addActivity(id, body.activityType, body.description, user.sub);
    }
    async close(req, id) {
        const user = req.user;
        return this.cases.close(id, user.sub);
    }
    async delete(id) {
        return this.cases.softDelete(id);
    }
};
exports.CasesController = CasesController;
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Query)('incidentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CasesController.prototype, "uploadFile", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.UserRole.EMPLOYEE, role_enum_1.UserRole.SUPERVISOR, role_enum_1.UserRole.MANAGER, role_enum_1.UserRole.SYSTEM_ADMINISTRATOR, role_enum_1.UserRole.OHS_PRACTITIONER, role_enum_1.UserRole.SECURITY_PRACTITIONER, role_enum_1.UserRole.FINANCE_OFFICIAL),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CasesController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.UserRole.SUPERVISOR, role_enum_1.UserRole.MANAGER, role_enum_1.UserRole.SYSTEM_ADMINISTRATOR, role_enum_1.UserRole.OHS_PRACTITIONER, role_enum_1.UserRole.SECURITY_PRACTITIONER, role_enum_1.UserRole.EMPLOYEE),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CasesController.prototype, "list", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('metrics/kpi'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CasesController.prototype, "getKpiMetrics", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('categories/list'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CasesController.prototype, "categories", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('employee/stats'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CasesController.prototype, "getEmployeeStats", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('hearings/upcoming'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CasesController.prototype, "getUpcomingHearings", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.UserRole.SYSTEM_ADMINISTRATOR),
    (0, common_1.Post)('categories'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CasesController.prototype, "createCategory", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.UserRole.SYSTEM_ADMINISTRATOR),
    (0, common_1.Put)('categories/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CasesController.prototype, "updateCategory", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.UserRole.SYSTEM_ADMINISTRATOR),
    (0, common_1.Delete)('categories/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CasesController.prototype, "deleteCategory", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.UserRole.SUPERVISOR, role_enum_1.UserRole.MANAGER, role_enum_1.UserRole.SYSTEM_ADMINISTRATOR, role_enum_1.UserRole.OHS_PRACTITIONER, role_enum_1.UserRole.SECURITY_PRACTITIONER),
    (0, common_1.Get)('sla/tracking'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CasesController.prototype, "getSlaTracking", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CasesController.prototype, "get", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.UserRole.SUPERVISOR, role_enum_1.UserRole.MANAGER, role_enum_1.UserRole.SYSTEM_ADMINISTRATOR, role_enum_1.UserRole.OHS_PRACTITIONER),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], CasesController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.UserRole.SUPERVISOR, role_enum_1.UserRole.SYSTEM_ADMINISTRATOR, role_enum_1.UserRole.MANAGER),
    (0, common_1.Put)(':id/assign'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], CasesController.prototype, "assign", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.UserRole.SUPERVISOR, role_enum_1.UserRole.SYSTEM_ADMINISTRATOR, role_enum_1.UserRole.MANAGER, role_enum_1.UserRole.OHS_PRACTITIONER, role_enum_1.UserRole.SECURITY_PRACTITIONER),
    (0, common_1.Put)(':id/status'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], CasesController.prototype, "updateStatus", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.UserRole.SUPERVISOR, role_enum_1.UserRole.SYSTEM_ADMINISTRATOR, role_enum_1.UserRole.MANAGER, role_enum_1.UserRole.OHS_PRACTITIONER, role_enum_1.UserRole.SECURITY_PRACTITIONER),
    (0, common_1.Put)(':id/escalate'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], CasesController.prototype, "escalate", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(':id/evidence'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], CasesController.prototype, "uploadEvidence", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':id/evidence'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CasesController.prototype, "listEvidence", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(':id/corrective-actions'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CasesController.prototype, "addCorrectiveAction", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)(':id/corrective-actions/:actionId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('actionId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], CasesController.prototype, "patchCorrectiveAction", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(':id/approvals'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], CasesController.prototype, "addApproval", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)(':id/approvals/:approvalId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('approvalId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], CasesController.prototype, "putApproval", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(':id/approvals/:approvalId/attachments'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('approvalId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], CasesController.prototype, "postApprovalAttachment", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':id/approvals/:approvalId/attachments/:attachmentId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('approvalId')),
    __param(2, (0, common_1.Param)('attachmentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], CasesController.prototype, "deleteApprovalAttachment", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':id/approvals/:approvalId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('approvalId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CasesController.prototype, "deleteApproval", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.UserRole.SUPERVISOR, role_enum_1.UserRole.SYSTEM_ADMINISTRATOR, role_enum_1.UserRole.MANAGER, role_enum_1.UserRole.OHS_PRACTITIONER),
    (0, common_1.Post)(':id/escalation-config'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CasesController.prototype, "createEscalationConfig", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':id/escalation-config'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CasesController.prototype, "getEscalationConfig", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.UserRole.SUPERVISOR, role_enum_1.UserRole.SYSTEM_ADMINISTRATOR, role_enum_1.UserRole.MANAGER, role_enum_1.UserRole.OHS_PRACTITIONER),
    (0, common_1.Put)(':id/escalation-config'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CasesController.prototype, "updateEscalationConfig", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.UserRole.SUPERVISOR, role_enum_1.UserRole.SYSTEM_ADMINISTRATOR, role_enum_1.UserRole.MANAGER, role_enum_1.UserRole.OHS_PRACTITIONER, role_enum_1.UserRole.SECURITY_PRACTITIONER, role_enum_1.UserRole.EMPLOYEE),
    (0, common_1.Post)(':id/comments'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], CasesController.prototype, "addComment", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':id/comments'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CasesController.prototype, "getComments", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':id/activity-timeline'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CasesController.prototype, "getActivityTimeline", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.UserRole.SUPERVISOR, role_enum_1.UserRole.SYSTEM_ADMINISTRATOR, role_enum_1.UserRole.MANAGER, role_enum_1.UserRole.OHS_PRACTITIONER, role_enum_1.UserRole.SECURITY_PRACTITIONER, role_enum_1.UserRole.EMPLOYEE),
    (0, common_1.Post)(':id/activity'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], CasesController.prototype, "addActivity", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.UserRole.MANAGER, role_enum_1.UserRole.SYSTEM_ADMINISTRATOR),
    (0, common_1.Put)(':id/close'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CasesController.prototype, "close", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.UserRole.SYSTEM_ADMINISTRATOR),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CasesController.prototype, "delete", null);
exports.CasesController = CasesController = __decorate([
    (0, swagger_1.ApiTags)('cases'),
    (0, common_1.Controller)('cases'),
    __metadata("design:paramtypes", [cases_service_1.CasesService,
        storage_service_1.StorageService])
], CasesController);
//# sourceMappingURL=cases.controller.js.map