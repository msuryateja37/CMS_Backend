import {
  Body,
  Controller,
  Delete,
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
import { SystemService } from './system.service';

@ApiTags('system')
@Controller('system')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SYSTEM_ADMINISTRATOR)
export class SystemController {
  constructor(private readonly system: SystemService) {}

  @Get('stats')
  async getAdminStats() {
    return this.system.getAdminStats();
  }

  @Get('roles')
  async listRoles() {
    return this.system.listRoles();
  }

  @Post('roles')
  async createRole(@Body() body: { name: string; description?: string }) {
    return this.system.createRole(body.name, body.description);
  }

  @Put('roles/:id')
  async updateRole(
    @Param('id') id: string,
    @Body() body: { name: string; description?: string },
  ) {
    return this.system.updateRole(id, body.name, body.description);
  }

  @Delete('roles/:id')
  async deleteRole(@Param('id') id: string) {
    return this.system.deleteRole(id);
  }

  @Get('permissions')
  async listPermissions() {
    return this.system.listPermissions();
  }

  @Post('permissions')
  async createPermission(@Body() body: { code: string; description?: string }) {
    return this.system.createPermission(body.code, body.description ?? '');
  }

  @Post('roles/:id/permissions')
  async syncRolePermissions(
    @Param('id') id: string,
    @Body() body: { permissionIds: string[] },
  ) {
    return this.system.syncRolePermissions(id, body.permissionIds);
  }
}
