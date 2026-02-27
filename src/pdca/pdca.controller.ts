import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../auth/enums/role.enum';
import { PdcaService } from './pdca.service';

@ApiTags('pdca')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('pdca')
export class PdcaController {
  constructor(private readonly pdca: PdcaService) {}

  // 47) Create PDCA Action (Manager)
  @Roles(UserRole.MANAGER, UserRole.SYSTEM_ADMINISTRATOR)
  @Post('actions')
  create(@Body() body: any) {
    return this.pdca.create(body);
  }

  // 48) Update PDCA (Phase-based)
  @Roles(UserRole.MANAGER, UserRole.SYSTEM_ADMINISTRATOR)
  @Put('actions/:id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.pdca.update(id, body);
  }

  // 49) Get PDCA Actions (Auth)
  @Roles(
    UserRole.EMPLOYEE,
    UserRole.SUPERVISOR,
    UserRole.MANAGER,
    UserRole.SYSTEM_ADMINISTRATOR,
    UserRole.OHS_PRACTITIONER,
    UserRole.FINANCE_OFFICIAL,
  )
  @Get('actions')
  list() {
    return this.pdca.list();
  }
}
