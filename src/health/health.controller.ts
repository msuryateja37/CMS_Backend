import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
  // 54) Health Check (Public)
  @Get()
  getHealth() {
    return { status: 'ok' };
  }
}
