import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../auth/enums/role.enum';
import { OhsService } from './ohs.service';

@ApiTags('ohs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('ohs')
export class OhsController {
  constructor(private readonly ohs: OhsService) {}

  // 24) Create Risk (OHS)
  @Roles(UserRole.OHS_PRACTITIONER, UserRole.SYSTEM_ADMINISTRATOR)
  @Post('risks')
  createRisk(@Req() req: Request, @Body() body: any) {
    const user = req.user as { sub: string };
    return this.ohs.createRisk(user.sub, body);
  }

  // 25) Get Risks (Auth)
  @Roles(
    UserRole.EMPLOYEE,
    UserRole.SUPERVISOR,
    UserRole.MANAGER,
    UserRole.SYSTEM_ADMINISTRATOR,
    UserRole.OHS_PRACTITIONER,
    UserRole.FINANCE_OFFICIAL,
  )
  @Get('risks')
  listRisks() {
    return this.ohs.listRisks();
  }

  // 26) Create JSA (OHS)
  @Roles(UserRole.OHS_PRACTITIONER, UserRole.SYSTEM_ADMINISTRATOR)
  @Post('jsa')
  createJsa(@Req() req: Request, @Body() body: any) {
    const user = req.user as { sub: string };
    return this.ohs.createJsa(user.sub, body);
  }

  // 27) Schedule Inspection (Supervisor)
  @Roles(UserRole.SUPERVISOR, UserRole.SYSTEM_ADMINISTRATOR)
  @Post('inspections')
  scheduleInspection(@Body() body: any) {
    return this.ohs.scheduleInspection(body);
  }

  // 28) Submit Inspection (OHS)
  @Roles(UserRole.OHS_PRACTITIONER, UserRole.SYSTEM_ADMINISTRATOR)
  @Put('inspections/:id')
  submitInspection(@Param('id') id: string, @Body() body: any) {
    return this.ohs.submitInspection(id, body);
  }

  // 29) Get Inspections (Auth)
  @Roles(
    UserRole.EMPLOYEE,
    UserRole.SUPERVISOR,
    UserRole.MANAGER,
    UserRole.SYSTEM_ADMINISTRATOR,
    UserRole.OHS_PRACTITIONER,
    UserRole.FINANCE_OFFICIAL,
  )
  @Get('inspections')
  listInspections(@Query('buildingId') buildingId?: string) {
    return this.ohs.listInspections(buildingId);
  }

  // 30) Add Finding (OHS)
  @Roles(UserRole.OHS_PRACTITIONER, UserRole.SYSTEM_ADMINISTRATOR)
  @Post('findings')
  addFinding(@Body() body: any) {
    return this.ohs.addFinding(body);
  }

  // 31) Close Finding (Supervisor)
  @Roles(UserRole.SUPERVISOR, UserRole.SYSTEM_ADMINISTRATOR)
  @Put('findings/:id/close')
  closeFinding(@Param('id') id: string) {
    return this.ohs.closeFinding(id);
  }

  // 32) Get Hazards
  @Roles(
    UserRole.EMPLOYEE,
    UserRole.SUPERVISOR,
    UserRole.MANAGER,
    UserRole.OHS_PRACTITIONER,
    UserRole.SYSTEM_ADMINISTRATOR,
  )
  @Get('hazards')
  listHazards() {
    return this.ohs.listHazards();
  }

  // 33) Get JSA List
  @Roles(
    UserRole.EMPLOYEE,
    UserRole.SUPERVISOR,
    UserRole.MANAGER,
    UserRole.OHS_PRACTITIONER,
    UserRole.SYSTEM_ADMINISTRATOR,
  )
  @Get('jsa')
  listJsa() {
    return this.ohs.listJsa();
  }

  // 34) Get SWP List
  @Roles(
    UserRole.EMPLOYEE,
    UserRole.SUPERVISOR,
    UserRole.MANAGER,
    UserRole.OHS_PRACTITIONER,
    UserRole.SYSTEM_ADMINISTRATOR,
  )
  @Get('swp')
  listSwp() {
    return this.ohs.listSwp();
  }
  // 35) Get OHS Stats
  @Roles(
    UserRole.EMPLOYEE,
    UserRole.SUPERVISOR,
    UserRole.MANAGER,
    UserRole.OHS_PRACTITIONER,
    UserRole.SYSTEM_ADMINISTRATOR,
  )
  @Get('stats')
  getStats() {
    return this.ohs.getStats();
  }
}
