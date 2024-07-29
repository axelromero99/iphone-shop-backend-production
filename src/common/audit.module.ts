// src/audit/audit.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuditLog, AuditLogSchema } from './schemas/audit-log.schema';
import { AuditLogService } from './services/audit-log.service';
import { AuditLogInterceptor } from './interceptors/audit-log.interceptor';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: AuditLog.name, schema: AuditLogSchema }]),
    ],
    providers: [AuditLogService, AuditLogInterceptor],
    exports: [AuditLogService, AuditLogInterceptor],
})
export class AuditModule { }