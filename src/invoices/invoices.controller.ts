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
import { InvoicesService } from './invoices.service';

@ApiTags('invoices')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoices: InvoicesService) {}

  // 32) Upload Invoice (Finance)
  @Roles(UserRole.FINANCE_OFFICIAL, UserRole.SYSTEM_ADMINISTRATOR)
  @Post()
  create(@Body() body: any) {
    return this.invoices.create(body);
  }

  // 33) Get Invoices (Finance)
  @Roles(UserRole.FINANCE_OFFICIAL, UserRole.SYSTEM_ADMINISTRATOR)
  @Get()
  list(@Query('status') status?: string) {
    return this.invoices.list(status);
  }

  // 34) Get Invoice (Finance)
  @Roles(UserRole.FINANCE_OFFICIAL, UserRole.SYSTEM_ADMINISTRATOR)
  @Get(':id')
  get(@Param('id') id: string) {
    return this.invoices.getById(id);
  }

  // 35) Approve Invoice (Supervisor)
  @Roles(UserRole.SUPERVISOR, UserRole.SYSTEM_ADMINISTRATOR)
  @Put(':id/approve')
  approve(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as { sub: string };
    return this.invoices.transition(id, 'APPROVED', user.sub);
  }

  // 36) Reject Invoice (Supervisor)
  @Roles(UserRole.SUPERVISOR, UserRole.SYSTEM_ADMINISTRATOR)
  @Put(':id/reject')
  reject(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() body: { reason: string },
  ) {
    const user = req.user as { sub: string };
    return this.invoices.transition(id, 'REJECTED', user.sub, body?.reason);
  }

  // 37) Invoice Actions (Finance)
  @Roles(UserRole.FINANCE_OFFICIAL, UserRole.SYSTEM_ADMINISTRATOR)
  @Get(':id/actions')
  actions(@Param('id') id: string) {
    return this.invoices.actions(id);
  }

  // 38) Finalize Invoice (Manager)
  @Roles(UserRole.MANAGER, UserRole.SYSTEM_ADMINISTRATOR)
  @Put(':id/finalize')
  finalize(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as { sub: string };
    return this.invoices.transition(id, 'COMPLETED', user.sub);
  }
}
