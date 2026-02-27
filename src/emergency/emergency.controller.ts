import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../auth/enums/role.enum';
import { EmergencyService } from './emergency.service';

@ApiTags('emergency')
@Controller('emergency')
export class EmergencyController {
  constructor(private readonly emergency: EmergencyService) {}

  // 39) Upload Emergency Plan (Admin)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SYSTEM_ADMINISTRATOR, UserRole.OHS_PRACTITIONER)
  @Post('plans')
  uploadPlan(@Body() body: any) {
    return this.emergency.createPlan(body);
  }

  // 40) Get Plans (Auth)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('plans')
  listPlans() {
    return this.emergency.listPlans();
  }

  // 41) Register Equipment (Admin)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SYSTEM_ADMINISTRATOR, UserRole.SECURITY_PRACTITIONER)
  @Post('equipment')
  registerEquipment(@Body() body: any) {
    return this.emergency.registerEquipment(body);
  }

  // 42) Get Equipment (Auth)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('equipment')
  listEquipment() {
    return this.emergency.listEquipment();
  }

  // 43) Record Drill (Supervisor)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    UserRole.SUPERVISOR,
    UserRole.SYSTEM_ADMINISTRATOR,
    UserRole.OHS_PRACTITIONER,
    UserRole.SECURITY_PRACTITIONER,
  )
  @Post('drills')
  recordDrill(@Body() body: any) {
    return this.emergency.recordDrill(body);
  }

  // 44) Get Drills (Auth)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('drills')
  listDrills() {
    return this.emergency.listDrills();
  }
}
