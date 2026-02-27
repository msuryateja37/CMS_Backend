import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../auth/enums/role.enum';
import { OrganizationService } from './organization.service';

@ApiTags('organization')
@Controller('org')
export class OrganizationController {
  constructor(private readonly org: OrganizationService) {}

  // 7) Create Province (Admin)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SYSTEM_ADMINISTRATOR)
  @Post('provinces')
  async createProvince(@Body() body: { name: string }) {
    return this.org.createProvince(body.name);
  }

  // 8) Get Provinces (Auth)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('provinces')
  async listProvinces() {
    return this.org.listProvinces();
  }

  // 9) Create Building (Admin)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SYSTEM_ADMINISTRATOR)
  @Post('buildings')
  async createBuilding(
    @Body()
    body: {
      name: string;
      provinceId: string;
      postalCode?: string;
      address?: string;
    },
  ) {
    return this.org.createBuilding(body);
  }

  // 10) Get Buildings (Auth)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('buildings')
  async listBuildings(@Query('provinceId') provinceId?: string) {
    return this.org.listBuildings(provinceId);
  }

  // Get Buildings by Province ID (specific endpoint)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('provinces/:provinceId/buildings')
  async getBuildingsByProvince(@Param('provinceId') provinceId: string) {
    return this.org.listBuildings(provinceId);
  }

  // 11) Create Department (Admin)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SYSTEM_ADMINISTRATOR)
  @Post('departments')
  async createDepartment(@Body() body: { name: string; buildingId: string }) {
    return this.org.createDepartment(body);
  }

  // 12) Get Departments (Auth)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('departments')
  async listDepartments(@Query('buildingId') buildingId?: string) {
    return this.org.listDepartments(buildingId);
  }

  // 13) Update Org Data (Admin) - type = provinces|buildings|departments
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SYSTEM_ADMINISTRATOR)
  @Put(':type/:id')
  async updateOrg(
    @Param('type') type: string,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.org.updateOrg(type, id, body);
  }
}
