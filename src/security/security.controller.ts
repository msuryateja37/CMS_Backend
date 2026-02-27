import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../auth/enums/role.enum';
import { SecurityService } from './security.service';

@ApiTags('security')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('security')
export class SecurityController {
  constructor(private readonly security: SecurityService) {}

  @Roles(UserRole.SECURITY_PRACTITIONER, UserRole.SYSTEM_ADMINISTRATOR)
  @Get('stats')
  getStats() {
    return this.security.getStats();
  }

  @Roles(UserRole.SECURITY_PRACTITIONER, UserRole.SYSTEM_ADMINISTRATOR)
  @Get('incidents')
  getIncidents() {
    return this.security.getIncidents();
  }

  @Roles(UserRole.SECURITY_PRACTITIONER, UserRole.SYSTEM_ADMINISTRATOR)
  @Get('charts/trends')
  getTrends() {
    return this.security.getIncidentTrends();
  }

  @Roles(UserRole.SECURITY_PRACTITIONER, UserRole.SYSTEM_ADMINISTRATOR)
  @Get('charts/severity')
  getSeverity() {
    return this.security.getSeverityDistribution();
  }

  @Roles(UserRole.SECURITY_PRACTITIONER, UserRole.SYSTEM_ADMINISTRATOR)
  @Post('incidents')
  createIncident(@Body() body: any) {
    return this.security.createIncident(body);
  }
}
