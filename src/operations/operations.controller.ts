import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../auth/enums/role.enum';
import { OperationsService } from './operations.service';

@ApiTags('operations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('operations')
export class OperationsController {
  constructor(private readonly operations: OperationsService) {}

  // Equipment
  @Get('equipment')
  @Roles(
    UserRole.EMPLOYEE,
    UserRole.SUPERVISOR,
    UserRole.MANAGER,
    UserRole.SYSTEM_ADMINISTRATOR,
  )
  listEquipment() {
    return this.operations.listEquipment();
  }

  // Inspections
  @Get('inspections')
  @Roles(
    UserRole.EMPLOYEE,
    UserRole.SUPERVISOR,
    UserRole.MANAGER,
    UserRole.SYSTEM_ADMINISTRATOR,
  )
  listInspections() {
    return this.operations.listInspections();
  }

  // Drills
  @Get('drills')
  @Roles(
    UserRole.EMPLOYEE,
    UserRole.SUPERVISOR,
    UserRole.MANAGER,
    UserRole.SYSTEM_ADMINISTRATOR,
  )
  listDrills() {
    return this.operations.listDrills();
  }

  // Audits
  @Get('audits')
  @Roles(
    UserRole.EMPLOYEE,
    UserRole.SUPERVISOR,
    UserRole.MANAGER,
    UserRole.SYSTEM_ADMINISTRATOR,
  )
  listAudits() {
    return this.operations.listAudits();
  }

  // Permits
  @Get('permits')
  @Roles(
    UserRole.EMPLOYEE,
    UserRole.SUPERVISOR,
    UserRole.MANAGER,
    UserRole.SYSTEM_ADMINISTRATOR,
  )
  listPermits() {
    return this.operations.listPermits();
  }
}
