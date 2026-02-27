import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../auth/enums/role.enum';
import { KpiService } from './kpi.service';

@ApiTags('kpi')
@Controller()
export class KpiController {
  constructor(private readonly kpi: KpiService) {}

  // Create KPI (Admin)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SYSTEM_ADMINISTRATOR)
  @Post('kpi')
  create(@Body() body: any) {
    return this.kpi.create(body);
  }

  // Get KPIs (Auth)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('kpi')
  list() {
    return this.kpi.list();
  }

  // Get Dashboard Metrics
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('kpi/metrics/dashboard')
  async getDashboardMetrics() {
    return this.kpi.getDashboardMetrics();
  }

  // Get Metrics by Province
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('kpi/metrics/province/:provinceId')
  async getMetricsByProvince(@Param('provinceId') provinceId: string) {
    return this.kpi.getMetricsByProvince(provinceId);
  }

  // Get Metrics by Building
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('kpi/metrics/building/:buildingId')
  async getMetricsByBuilding(@Param('buildingId') buildingId: string) {
    return this.kpi.getMetricsByBuilding(buildingId);
  }

  // Get Metrics by Category
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('kpi/metrics/category/:categoryId')
  async getMetricsByCategory(@Param('categoryId') categoryId: string) {
    return this.kpi.getMetricsByCategory(categoryId);
  }

  // Get Metrics by Priority
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('kpi/metrics/priority')
  async getMetricsByPriority() {
    return this.kpi.getMetricsByPriority();
  }

  // Record KPI Value (Scheduled)
  // Kept authenticated for now; can be swapped to API key/cron auth later.
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SYSTEM_ADMINISTRATOR, UserRole.MANAGER)
  @Post('kpi/records')
  record(@Body() body: any) {
    return this.kpi.record(body);
  }
}
