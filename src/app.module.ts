// src/app.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';

import { SalesModule } from './sales/sales.module';
import { TechnicalServiceModule } from './technical-service/technical-service.module';
import { InventoryModule } from './inventory/inventory.module';
import { CashRegisterModule } from './cash-register/cash-register.module';
import { ExpensesModule } from './expenses/expenses.module';
import { CloudinaryModule } from './common/cloudinary.module';
import { BannersModule } from './banner/banner.module';
import { AuditModule } from './audit/audit.module'; // Importa el AuditModule

import cloudinaryConfig from './config/cloudinary.config';
import databaseConfig from './config/database.config';

import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuditLogInterceptor } from './audit/audit-log.interceptor';

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditLogInterceptor,
    },
  ],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, cloudinaryConfig],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    ProductsModule,
    SalesModule,
    TechnicalServiceModule,
    InventoryModule,
    CashRegisterModule,
    ExpensesModule,
    CloudinaryModule,
    BannersModule,
    AuditModule, // Añade el AuditModule aquí
  ],
})
export class AppModule { }