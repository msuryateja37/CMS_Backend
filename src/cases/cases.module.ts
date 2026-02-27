import { Module } from '@nestjs/common';
import { CasesController } from './cases.controller';
import { CasesService } from './cases.service';
import { SystemModule } from '../system/system.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [SystemModule, NotificationsModule],
  controllers: [CasesController],
  providers: [CasesService],
})
export class CasesModule {}
