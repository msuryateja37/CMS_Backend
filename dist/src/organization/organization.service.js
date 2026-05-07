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
exports.OrganizationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let OrganizationService = class OrganizationService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createProvince(name) {
        if (!name)
            throw new common_1.BadRequestException('name is required');
        return this.prisma.province.create({ data: { name } });
    }
    async listProvinces() {
        return this.prisma.province.findMany({ orderBy: { name: 'asc' } });
    }
    async createBuilding(input) {
        return this.prisma.building.create({
            data: {
                name: input.name,
                provinceId: input.provinceId,
                postalCode: input.postalCode,
                address: input.address,
            },
        });
    }
    async listBuildings(provinceId) {
        return this.prisma.building.findMany({
            where: provinceId ? { provinceId } : undefined,
            orderBy: { name: 'asc' },
        });
    }
    async createDepartment(input) {
        return this.prisma.department.create({
            data: { name: input.name, buildingId: input.buildingId },
        });
    }
    async listDepartments(buildingId) {
        return this.prisma.department.findMany({
            where: buildingId ? { buildingId } : undefined,
            orderBy: { name: 'asc' },
        });
    }
    async updateOrg(type, id, body) {
        if (type === 'provinces') {
            return this.prisma.province.update({
                where: { id },
                data: { name: body.name },
            });
        }
        if (type === 'buildings') {
            return this.prisma.building.update({
                where: { id },
                data: {
                    name: body.name,
                    provinceId: body.provinceId,
                    postalCode: body.postalCode,
                    address: body.address,
                },
            });
        }
        if (type === 'departments') {
            return this.prisma.department.update({
                where: { id },
                data: { name: body.name, buildingId: body.buildingId },
            });
        }
        throw new common_1.NotFoundException('Unknown org type');
    }
};
exports.OrganizationService = OrganizationService;
exports.OrganizationService = OrganizationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrganizationService);
//# sourceMappingURL=organization.service.js.map