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
exports.FormsController = void 0;
const common_1 = require("@nestjs/common");
const forms_service_1 = require("./forms.service");
let FormsController = class FormsController {
    formsService;
    constructor(formsService) {
        this.formsService = formsService;
    }
    getForms() {
        return this.formsService.getForms();
    }
    createForm(dto) {
        return this.formsService.createForm(dto);
    }
    getFormById(id) {
        return this.formsService.getFormById(id);
    }
    getActiveSchema(id) {
        return this.formsService.getActiveSchema(id);
    }
    getActiveSchemaBySlug(slug) {
        return this.formsService.getActiveSchemaBySlug(slug);
    }
    getVersions(id) {
        return this.formsService.getVersions(id);
    }
    createVersion(formId, dto) {
        return this.formsService.createVersion(formId, dto);
    }
    publishVersion(versionId) {
        return this.formsService.publishVersion(versionId);
    }
    archiveVersion(versionId) {
        return this.formsService.archiveVersion(versionId);
    }
    updateCanvas(versionId, dto) {
        return this.formsService.updateCanvas(versionId, dto);
    }
    submitResponse(formId, dto) {
        return this.formsService.submitResponse(formId, dto);
    }
    getResponses(formId, page, limit) {
        return this.formsService.getResponses(formId, page, limit);
    }
    getResponse(responseId) {
        return this.formsService.getResponse(responseId);
    }
    getQuestionAnalytics(questionId) {
        return this.formsService.getQuestionAnalytics(questionId);
    }
    getFormByTitleKeyword(keyword) {
        return this.formsService.getFormByTitleKeyword(keyword);
    }
};
exports.FormsController = FormsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FormsController.prototype, "getForms", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], FormsController.prototype, "createForm", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FormsController.prototype, "getFormById", null);
__decorate([
    (0, common_1.Get)(':id/schema'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FormsController.prototype, "getActiveSchema", null);
__decorate([
    (0, common_1.Get)('by-slug/:slug'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FormsController.prototype, "getActiveSchemaBySlug", null);
__decorate([
    (0, common_1.Get)(':id/versions'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FormsController.prototype, "getVersions", null);
__decorate([
    (0, common_1.Post)(':id/versions'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Function]),
    __metadata("design:returntype", void 0)
], FormsController.prototype, "createVersion", null);
__decorate([
    (0, common_1.Patch)('versions/:versionId/publish'),
    __param(0, (0, common_1.Param)('versionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FormsController.prototype, "publishVersion", null);
__decorate([
    (0, common_1.Patch)('versions/:versionId/archive'),
    __param(0, (0, common_1.Param)('versionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FormsController.prototype, "archiveVersion", null);
__decorate([
    (0, common_1.Patch)('versions/:versionId/canvas'),
    __param(0, (0, common_1.Param)('versionId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Function]),
    __metadata("design:returntype", void 0)
], FormsController.prototype, "updateCanvas", null);
__decorate([
    (0, common_1.Post)(':id/responses'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Function]),
    __metadata("design:returntype", void 0)
], FormsController.prototype, "submitResponse", null);
__decorate([
    (0, common_1.Get)(':id/responses'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(20), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", void 0)
], FormsController.prototype, "getResponses", null);
__decorate([
    (0, common_1.Get)('responses/:responseId'),
    __param(0, (0, common_1.Param)('responseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FormsController.prototype, "getResponse", null);
__decorate([
    (0, common_1.Get)('analytics/question/:questionId'),
    __param(0, (0, common_1.Param)('questionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FormsController.prototype, "getQuestionAnalytics", null);
__decorate([
    (0, common_1.Get)('search/by-title'),
    __param(0, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FormsController.prototype, "getFormByTitleKeyword", null);
exports.FormsController = FormsController = __decorate([
    (0, common_1.Controller)('forms'),
    __metadata("design:paramtypes", [forms_service_1.FormsService])
], FormsController);
//# sourceMappingURL=forms.controller.js.map