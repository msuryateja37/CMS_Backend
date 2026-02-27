import { Module } from '@nestjs/common';
import { OhsController } from './ohs.controller';
import { OhsService } from './ohs.service';

@Module({
  controllers: [OhsController],
  providers: [OhsService],
})
export class OhsModule {}
