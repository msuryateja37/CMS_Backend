import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { SyncService } from './sync.service';
import { UserRole } from '../auth/enums/role.enum';

@ApiTags('sync')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('sync')
export class SyncController {
  constructor(private readonly sync: SyncService) { }

  // 51) Mobile Sync Push (Mobile)
  @Roles(
    UserRole.EMPLOYEE,
    UserRole.SUPERVISOR,
    UserRole.MANAGER,
    UserRole.SYSTEM_ADMINISTRATOR,
    UserRole.OHS_PRACTITIONER,
    UserRole.FINANCE_OFFICIAL,
  )
  @Post('push')
  push(@Req() req: Request, @Body() body: any) {
    const user = req.user as { sub: string };
    return this.sync.push(user.sub, body);
  }

  // 52) Mobile Sync Pull (Mobile)
  @Roles(
    UserRole.EMPLOYEE,
    UserRole.SUPERVISOR,
    UserRole.MANAGER,
    UserRole.SYSTEM_ADMINISTRATOR,
    UserRole.OHS_PRACTITIONER,
    UserRole.FINANCE_OFFICIAL,
  )
  @Get('pull')
  pull(@Query('since') since?: string) {
    return this.sync.pull(since);
  }

  // 53) Conflict Resolution (System)
  @Roles(UserRole.SYSTEM_ADMINISTRATOR)
  @Post('resolve')
  resolve(@Body() body: any) {
    return this.sync.resolve(body);
  }
}
