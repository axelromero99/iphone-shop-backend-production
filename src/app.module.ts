import { join } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';

import { ProductsModule } from './products/products.module';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MailModule } from './mail/mail.module';


import { SalesModule } from './sales/sales.module';
import { TechnicalServiceModule } from './technical-service/technical-service.module';
import { InventoryModule } from './inventory/inventory.module';
import { CashRegisterModule } from './cash-register/cash-register.module';
import { ExpensesModule } from './expenses/expenses.module';
import { CloudinaryModule } from './common/cloudinary.module';
import { ProviderModule } from './providers/provider.module';
import { BannersModule } from './banner/banner.module';
// import { AuditModule } from './audit/audit.module'; // Importa el AuditModule

import cloudinaryConfig from './config/cloudinary.config';



@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [cloudinaryConfig],
    }),

    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/yourDatabaseName', {
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),

    ProductsModule,

    SalesModule,
    TechnicalServiceModule,
    InventoryModule,
    CashRegisterModule,
    ExpensesModule,
    CloudinaryModule,
    ProviderModule,
    BannersModule,
    // AuditModule,


    CommonModule,

    AuthModule,

    MailModule,

  ],
})

export class AppModule { }
