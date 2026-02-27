import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersController, UsersPublicController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController, UsersPublicController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
