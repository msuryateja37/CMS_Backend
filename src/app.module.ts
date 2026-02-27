import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { OrganizationModule } from './organization/organization.module';
import { CasesModule } from './cases/cases.module';
import { OhsModule } from './ohs/ohs.module';
import { InvoicesModule } from './invoices/invoices.module';
import { EmergencyModule } from './emergency/emergency.module';
import { KpiModule } from './kpi/kpi.module';
import { PdcaModule } from './pdca/pdca.module';
import { AuditModule } from './audit/audit.module';
import { SyncModule } from './sync/sync.module';
import { HealthModule } from './health/health.module';
import { SystemModule } from './system/system.module';
import { SecurityModule } from './security/security.module';

import { OperationsModule } from './operations/operations.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    OrganizationModule,
    CasesModule,
    OhsModule,
    InvoicesModule,
    EmergencyModule,
    KpiModule,
    PdcaModule,
    AuditModule,
    SyncModule,
    HealthModule,
    SystemModule,
    SecurityModule,
    OperationsModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
