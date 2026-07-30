import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DressingRegistryService } from './dressing-registry.service';
import { CreateDressingEntryDto } from './dto/create-dressing-entry.dto';

@ApiTags('dressing-registry')
@Controller('dressing-registry')
export class DressingRegistryController {
  constructor(private readonly service: DressingRegistryService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Req() req: Request, @Body() dto: CreateDressingEntryDto) {
    const user = req.user as { sub: string };
    return this.service.create(user.sub, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('my')
  async getForUser(@Req() req: Request) {
    const user = req.user as { sub: string };
    return this.service.getForUser(user.sub);
  }
}
