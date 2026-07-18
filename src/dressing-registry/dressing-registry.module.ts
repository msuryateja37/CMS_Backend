import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { DressingRegistryController } from './dressing-registry.controller';
import { DressingRegistryService } from './dressing-registry.service';

@Module({
  imports: [PrismaModule],
  controllers: [DressingRegistryController],
  providers: [DressingRegistryService],
  exports: [DressingRegistryService],
})
export class DressingRegistryModule {}
