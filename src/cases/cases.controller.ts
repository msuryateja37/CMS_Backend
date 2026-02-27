import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../auth/enums/role.enum';
import { CasesService } from './cases.service';
import { StorageService } from '../system/storage.service';

@ApiTags('cases')
@Controller('cases')
export class CasesController {
  constructor(
    private readonly cases: CasesService,
    private readonly storage: StorageService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query('incidentId') incidentId?: string,
  ) {
    const url = await this.storage.uploadFile(file, incidentId || 'evidence');
    return {
      url,
      name: file.originalname,
      size: file.size,
      type: file.mimetype,
    };
  }

  // Create Incident (EMPLOYEE)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    UserRole.EMPLOYEE,
    UserRole.SUPERVISOR,
    UserRole.MANAGER,
    UserRole.SYSTEM_ADMINISTRATOR,
    UserRole.OHS_PRACTITIONER,
    UserRole.SECURITY_PRACTITIONER,
    UserRole.FINANCE_OFFICIAL,
  )
  @Post()
  async create(@Req() req: Request, @Body() body: any) {
    const user = req.user as { sub: string };
    return this.cases.create(user.sub, body);
  }

  // Get All Cases (SUPERVISOR+)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    UserRole.SUPERVISOR,
    UserRole.MANAGER,
    UserRole.SYSTEM_ADMINISTRATOR,
    UserRole.OHS_PRACTITIONER,
    UserRole.SECURITY_PRACTITIONER,
    UserRole.EMPLOYEE,
  )
  @Get()
  async list(@Query() query: any) {
    return this.cases.list(query);
  }

  // Get KPI Metrics
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('metrics/kpi')
  async getKpiMetrics() {
    return this.cases.getKpiMetrics();
  }

  // Incident Categories (Auth)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('categories/list')
  async categories() {
    return this.cases.listCategories();
  }

  // Employee Dashboard Endpoints
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('employee/stats')
  async getEmployeeStats(@Req() req: Request) {
    const user = req.user as { sub: string };
    return this.cases.getEmployeeStats(user.sub);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('hearings/upcoming')
  async getUpcomingHearings(@Req() req: Request) {
    const user = req.user as { sub: string };
    return this.cases.getUpcomingHearings(user.sub);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SYSTEM_ADMINISTRATOR)
  @Post('categories')
  async createCategory(@Body() body: any) {
    return this.cases.createCategory(body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SYSTEM_ADMINISTRATOR)
  @Put('categories/:id')
  async updateCategory(@Param('id') id: string, @Body() body: any) {
    return this.cases.updateCategory(id, body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SYSTEM_ADMINISTRATOR)
  @Delete('categories/:id')
  async deleteCategory(@Param('id') id: string) {
    return this.cases.deleteCategory(id);
  }

  // SLA Tracking (must be before :id route)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    UserRole.SUPERVISOR,
    UserRole.MANAGER,
    UserRole.SYSTEM_ADMINISTRATOR,
    UserRole.OHS_PRACTITIONER,
    UserRole.SECURITY_PRACTITIONER,
  )
  @Get('sla/tracking')
  async getSlaTracking() {
    return this.cases.getSlaTracking();
  }

  // Get Case by ID (Auth)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async get(@Param('id') id: string) {
    return this.cases.getById(id);
  }

  // Update Case
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    UserRole.SUPERVISOR,
    UserRole.MANAGER,
    UserRole.SYSTEM_ADMINISTRATOR,
    UserRole.OHS_PRACTITIONER,
  )
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.cases.update(id, body);
  }

  // Assign Case (SUPERVISOR)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERVISOR, UserRole.SYSTEM_ADMINISTRATOR, UserRole.MANAGER)
  @Put(':id/assign')
  async assign(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() body: { assignedToId: string },
  ) {
    const user = req.user as { sub: string };
    return this.cases.assign(id, body.assignedToId, user.sub);
  }

  // Update Case Status (SUPERVISOR, OHS, SECURITY)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    UserRole.SUPERVISOR,
    UserRole.SYSTEM_ADMINISTRATOR,
    UserRole.MANAGER,
    UserRole.OHS_PRACTITIONER,
    UserRole.SECURITY_PRACTITIONER,
  )
  @Put(':id/status')
  async updateStatus(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() body: { status: string },
  ) {
    const user = req.user as { sub: string };
    return this.cases.updateStatus(id, body.status, user.sub);
  }

  // Escalate Case (Peer-to-peer: practitioner to same-role practitioner)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    UserRole.SUPERVISOR,
    UserRole.SYSTEM_ADMINISTRATOR,
    UserRole.MANAGER,
    UserRole.OHS_PRACTITIONER,
    UserRole.SECURITY_PRACTITIONER,
  )
  @Put(':id/escalate')
  async escalate(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() body: { assignedToId: string; reason: string },
  ) {
    const user = req.user as { sub: string };
    return this.cases.escalate(id, user.sub, body);
  }

  // Upload Evidence (Auth) - metadata only for now
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/evidence')
  async uploadEvidence(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    const user = req.user as { sub: string };
    return this.cases.addEvidence(id, user.sub, body);
  }

  // Get Case Evidence (Auth)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id/evidence')
  async listEvidence(@Param('id') id: string) {
    return this.cases.listEvidence(id);
  }

  // Escalation Config - Create
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    UserRole.SUPERVISOR,
    UserRole.SYSTEM_ADMINISTRATOR,
    UserRole.MANAGER,
    UserRole.OHS_PRACTITIONER,
  )
  @Post(':id/escalation-config')
  async createEscalationConfig(@Param('id') id: string, @Body() body: any) {
    return this.cases.createEscalationConfig(id, body);
  }

  // Escalation Config - Get
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id/escalation-config')
  async getEscalationConfig(@Param('id') id: string) {
    return this.cases.getEscalationConfig(id);
  }

  // Escalation Config - Update
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    UserRole.SUPERVISOR,
    UserRole.SYSTEM_ADMINISTRATOR,
    UserRole.MANAGER,
    UserRole.OHS_PRACTITIONER,
  )
  @Put(':id/escalation-config')
  async updateEscalationConfig(@Param('id') id: string, @Body() body: any) {
    return this.cases.updateEscalationConfig(id, body);
  }

  // Comments - Add
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    UserRole.SUPERVISOR,
    UserRole.SYSTEM_ADMINISTRATOR,
    UserRole.MANAGER,
    UserRole.OHS_PRACTITIONER,
    UserRole.SECURITY_PRACTITIONER,
    UserRole.EMPLOYEE,
  )
  @Post(':id/comments')
  async addComment(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() body: { comment: string },
  ) {
    const user = req.user as { sub: string };
    return this.cases.addComment(id, user.sub, body.comment);
  }

  // Comments - Get
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id/comments')
  async getComments(@Param('id') id: string) {
    return this.cases.getComments(id);
  }

  // Activity Timeline - Get
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id/activity-timeline')
  async getActivityTimeline(@Param('id') id: string) {
    return this.cases.getActivityTimeline(id);
  }

  // Activity Timeline - Add
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    UserRole.SUPERVISOR,
    UserRole.SYSTEM_ADMINISTRATOR,
    UserRole.MANAGER,
    UserRole.OHS_PRACTITIONER,
    UserRole.SECURITY_PRACTITIONER,
    UserRole.EMPLOYEE,
  )
  @Post(':id/activity')
  async addActivity(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    const user = req.user as { sub: string };
    return this.cases.addActivity(
      id,
      body.activityType,
      body.description as string,
      user.sub,
    );
  }

  // Close Case (MANAGER)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MANAGER, UserRole.SYSTEM_ADMINISTRATOR)
  @Put(':id/close')
  async close(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as { sub: string };
    return this.cases.close(id, user.sub);
  }

  // Delete Case (Admin) - soft delete simulated by status=DELETED
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SYSTEM_ADMINISTRATOR)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.cases.softDelete(id);
  }
}
