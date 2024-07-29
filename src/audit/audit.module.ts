// src/audit/audit.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuditLog, AuditLogSchema } from 'src/schemas/audit-log.schema';
import { AuditLogService } from './audit-log.service';
import { AuditLogInterceptor } from './audit-log.interceptor';
import { AuthModule } from '../auth/auth.module'; // Importa AuthModule en lugar de UserModule

@Module({
    imports: [
        MongooseModule.forFeature([{ name: AuditLog.name, schema: AuditLogSchema }]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
            }),
            inject: [ConfigService],
        }),
        AuthModule, // Importa AuthModule aquí
    ],
    providers: [AuditLogService, AuditLogInterceptor],
    exports: [AuditLogService, AuditLogInterceptor],
})
export class AuditModule { }