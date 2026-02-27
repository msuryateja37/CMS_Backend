import { Module } from '@nestjs/common';
import { PdcaController } from './pdca.controller';
import { PdcaService } from './pdca.service';

@Module({
  controllers: [PdcaController],
  providers: [PdcaService],
})
export class PdcaModule {}
